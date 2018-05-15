import * as dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import * as path from 'path'
import * as Raven from 'raven'
import { Parser } from 'xml2js'
import * as _ from 'lodash'
import * as PlayerService from '../src/services/player'
import models from '../src/models'
import * as Sequelize from 'sequelize';
const { Player, Fixture, Club, Standing, sequelize } = models
sequelize.options.logging = false

Raven.config(process.env.SENTRY_DSN).install();

const parser = new Parser({ normalize: true, explicitArray: false })

const feedPath = process.env.FEED_PATH
const DELAY_RATE = 1000

const parseString = (data) => {
    return new Promise((resolve, reject) => {
        parser.parseString(data, (error, result) => {
            if (error) {
                return reject(error)
            } else {
                return resolve(result)
            }
        })
    })
}

export const wait = (ms = 5000) => new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
});

const queue: string[] = []
let processing = false

fs.watch(feedPath, (eventType, filename) => {
    if (filename) {
        const filePath = path.join(feedPath, filename)
        if (fs.existsSync(filePath)) {
            if (queue.indexOf(filePath) === -1) {
                if (filePath.includes('.xml')) {
                    console.log('Adding', filename, 'to the queue...')
                    queue.unshift(filePath)
                    if (!processing) {
                        startProcess()
                    }
                }
            }
        }
    }
})

const startProcess = async () => {
    processing = true
    while (queue.length) {
        const filePath = queue[queue.length - 1]
        try {
            console.log('Attempting to upsert', path.basename(filePath))
            await processFile(filePath)
            queue.pop()
            console.log('Succesfully upserted', path.basename(filePath))
        } catch (error) {
            queue.pop()
            console.error(error)
            Raven.captureException(error)
        }
    }
    processing = false
}

const processFile = async (filePath) => {
    const filename = path.basename(filePath)
    const transaction: Sequelize.Transaction = await sequelize.transaction()

    try {
        if (filename.includes('-matchresults.xml')) {
            await parseMatchResult(filePath, transaction)
        }
        if (filename.includes('-results.xml')) {
            await parseResults(filePath, transaction)
        }
        if (filename.includes('-standings.xml')) {
            await parseStandings(filePath, transaction)
        }
        if (filename.includes('-squads.xml')) {
            await parseSquads(filePath, transaction)
        }
        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        error.message = `Error with ${filename}: ${error.message}`
        throw error
    }
}

// PARSE RESULTS

const parseResults = async (fileName, transaction) => {
    const data = fs.readFileSync(fileName)
    const result: any = await parseString(data)
    const matchData = result.SoccerFeed.SoccerDocument.MatchData
    return Promise.all(
        matchData.map(async match => {
            const gameWeek = match.MatchInfo.$.MatchDay
            const gameId = match.$.uID
            const date = match.MatchInfo.Date // this is going to be in BST (british time)
            const teams: any = {}
            match.TeamData.forEach(team => {
                teams[team.$.Side] = {
                    score: team.$.Score || -1,
                    id: team.$.TeamRef
                }
            })
            const homeClub: any = await Club.findOne({
                where: {
                    optaId: teams.Home.id
                }
            })
            const awayClub: any = await Club.findOne({
                where: {
                    optaId: teams.Away.id
                }
            })
            const fixture = {
                optaId: gameId,
                homeScore: teams.Home.score,
                awayScore: teams.Away.score,
                gameDate: date + '+01', // TODO: convert this to not BST when daylight savings happens
                week: gameWeek,
                homeId: homeClub.id,
                awayId: awayClub.id
            }
            return Fixture.upsert(fixture, { transaction })
        })
    )

}

// PARSE MATCH RESULT

const parseMatchResult = async (fileName, transaction) => {
    const data = fs.readFileSync(fileName)
    const result: any = await parseString(data)
    const optaFixtureId = result.SoccerFeed.SoccerDocument.$.uID.replace('f', 'g')
    const matchData = result.SoccerFeed.SoccerDocument.MatchData
    const teamData = matchData.TeamData
    return Promise.all(
        teamData.map(async team => {
            const isHome = team.$.Side === 'Home'
            return Promise.all(
                team.PlayerLineUp.MatchPlayer.map(async player => {
                    const optaId = player.$.PlayerRef
                    const isStarter = player.$.Status === 'Start'
                    const playerStat: any = {}
                    if (player.Stat.length) {
                        player.Stat.forEach(stat => {
                            playerStat[stat.$.Type] = stat._
                        })
                    } else {
                        playerStat[player.Stat.$.Type] = player.Stat._
                    }
                    return PlayerService.upsertStat(optaId, optaFixtureId, playerStat, isHome, isStarter, transaction)
                })
            )
        })
    )
}

// PARSE STANDINGS

const parseStandings = async (fileName, transaction) => {
    const data = fs.readFileSync(fileName)
    const result: any = await parseString(data)
    const teamRecords = result.SoccerFeed.SoccerDocument.Competition.TeamStandings.TeamRecord
    return Promise.all(
        teamRecords.map(async record => {
            const optaClubId = record.$.TeamRef
            const standing = {}
            Object.keys(record.Standing).forEach(key => {
                if (key !== '$') {
                    standing[_.camelCase(key)] = record.Standing[key]
                }
            })

            const club: any = await Club.findOne({
                where: {
                    optaId: optaClubId
                }
            })

            return Standing.upsert({
                clubId:  club.id,
                season: 2017,
                league: 'EPL',
                standingObj: standing
            }, { transaction })

        })
    )
}

const parseSquads = async (fileName, transaction) => {
    const data = fs.readFileSync(fileName)
    const result: any = await parseString(data)
    let teams = result.SoccerFeed.SoccerDocument.Team
    teams = teams.concat(result.SoccerFeed.SoccerDocument.PlayerChanges.Team)

    return Promise.all(
        teams.map(async (team, index) => {
            const optaClubId = team.$.uID
            const club: any = await Club.findOne({
                where: {
                    optaId: optaClubId
                }
            })
            await wait(index * DELAY_RATE)
            const players = team.Player
            return Promise.all(
                players.map(async player => {
                    const optaId = player.$.uID
                    const name = player.Name
                    const position = player.Position
                    const playerInfo: any = {}
                    if (player.Stat.length) {
                        player.Stat.forEach(stat => {
                            playerInfo[stat.$.Type] = stat._
                        })
                    } else {
                        playerInfo[player.Stat.$.Type] = player.Stat._
                    }
                    return Player.upsert({
                        optaId,
                        name,
                        shortName: convertToShortName(name),
                        position,
                        birthDate: playerInfo.birth_date,
                        country: playerInfo.country,
                        nationality: playerInfo.first_nationality || null,
                        height: playerInfo.height === 'Unknown' ? null : playerInfo.height,
                        weight: playerInfo.weight === 'Unknown' ? null : playerInfo.weight,
                        realPosition: playerInfo.real_position,
                        realPositionSide: playerInfo.real_position_side,
                        clubId: club.id,
                        leaveDate: playerInfo.leave_date
                    }, { transaction })

                })
            )
        })
    )
}

const convertToShortName = (name) => {
    const initial = name.slice(0, 1)
    const splitName = name.split(' ')
    return `${initial}. ${splitName.slice(1).join(' ')}`
}