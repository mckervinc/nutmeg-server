import * as dotenv from 'dotenv'
dotenv.config()
import * as fs from 'fs'
import * as path from 'path'

import { Parser } from 'xml2js'
import * as PlayerService from '../src/services/player'
import models from '../src/models'
const { Fixture, Club } = models

// WATCH

const parser = new Parser({ normalize: true, explicitArray: false })

const feedPath = process.env.FEED_PATH

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

fs.watch(feedPath, async (eventType, filename) => {
    console.log(eventType)
    if (filename) {
        const filePath = path.join(feedPath, filename)
        if (fs.existsSync(filePath)) {

            if (filename.includes('matchresults.xml')) {
                console.log('Upserting', filename)
                try {
                    await parseMatchResult(filePath)
                    console.log('Upserted')
                } catch (error) {
                    console.error('[WATCHER-ERROR]', error)
                }
            }

            if (filename.includes('-results.xml')) {
                console.log('Upserting', filename)
                try {
                    await parseResults(filePath)
                    console.log('Upserted')
                } catch (error) {
                    console.error('[WATCHER-ERROR]', error)
                }
            }
        }

    }
})

// PARSE RESULTS

const parseResults = async (fileName) => {
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
                gameWeek,
                homeId: homeClub.id,
                awayId: awayClub.id
            }
            return Fixture.upsert(fixture)
        })
    )

}

// PARSE MATCH RESULT

const parseMatchResult = async (fileName) => {
    const data = fs.readFileSync(fileName)
    const result: any = await parseString(data)
    const optaFixtureId = result.SoccerFeed.SoccerDocument.$.uID.replace('f', 'g')
    const matchData = result.SoccerFeed.SoccerDocument.MatchData
    const teamData = matchData.TeamData
    return Promise.all(
        teamData.map(team => {
            const side = team.$.Side
            return Promise.all(
                team.PlayerLineUp.MatchPlayer.map(player => {
                    const optaId = player.$.PlayerRef
                    const playerStat: any = {
                        side
                    }
                    if (player.Stat.length) {
                        player.Stat.forEach(stat => {
                            playerStat[stat.$.Type] = stat._
                        })
                    } else {
                        playerStat[player.Stat.$.Type] = player.Stat._
                    }
                    if (playerStat.mins_played) {
                        return PlayerService.upsertStat(optaId, optaFixtureId, playerStat)
                    }
                })
            )
        })
    )
}