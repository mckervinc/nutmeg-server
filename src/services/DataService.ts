import * as dotenv from 'dotenv'
dotenv.config()
import * as rp from 'request-promise'
import { db } from '../drivers'

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const statMapping = {
    A: 'assists',
    AER: 'aerials_won',
    CC: 'key_passes',
    CLR: 'clearances',
    CS: 'clean_sheets',
    DIS: 'dispossessions',
    G: 'goals',
    GC: 'goals_conceded',
    INT: 'interceptions',
    M: 'minutes',
    OG: 'own_goals',
    PS: 'penalty_saves',
    RC: 'red_cards',
    SCR: 'successful_crosses',
    SOT: 'shots_on_target',
    STO: 'successful_touches',
    SV: 'saves',
    TW: 'tackles_won',
    YC: 'yellow_cards',
    BS: 0, // blocked shots
    PM: 0,
    SP: 0,
    FW: 0,
    SA: 0,
    SH: 0,
    FC: 0,
    STB: 0,
    P: 0,
    C: 0,
    PW: 0 // posessions won
}

const doStuff = async () => {
    const result = await rp({
        url: 'https://api.playtogga.com/players/getplayerlist',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'cookie': 'togga_key=57a7f01c0b991e1100e02573; togga_id=57a7f01c0b991e1100e02573; toggasession=5aca31a044368a0010882e5d'
        },
        json: true,
        method: 'POST',
        body: {
            league_id: '5988dd068f8a17000131ff0a',
            team_id: '598bcdd89d14f20001985581'
        }
    })

    result.info = result.info.slice(425)
    for (const player of result.info) {
        const club = await db.query('clubs', { short_name: player.clubName })
        const clubId = club[0].id
        const waitTime = Math.floor(Math.random() * 5000) + 1000
        console.log('Waiting', waitTime / 1000)
        await timeout(waitTime)
        let playerData
        try {
            playerData = await rp({
                url: 'https://api.playtogga.com/players/getplayerinfo',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 \
                                    (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                    'cookie': 'togga_key=57a7f01c0b991e1100e02573; togga_id=57a7f01c0b991e1100e02573; toggasession=5aca31a044368a0010882e5d'
                },
                json: true,
                method: 'POST',
                body: {
                    player_id: player.playerId
                }
            })
        } catch (err) {
            console.log('RATE LIMITED... WAITING 2 MIN')
            await timeout(120000)
            playerData = await rp({
                url: 'https://api.playtogga.com/players/getplayerinfo',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 \
                                    (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                    'cookie': 'togga_key=57a7f01c0b991e1100e02573; togga_id=57a7f01c0b991e1100e02573; toggasession=5aca31a044368a0010882e5d'
                },
                json: true,
                method: 'POST',
                body: {
                    player_id: player.playerId
                }
            })
        }
        const toInsert = {
            opta_id: player.playerOptaRef,
            name: player.name,
            short_name: player.shortName,
            position: playerData.info.position,
            club_id: clubId,
            birth_date: playerData.info.birthDate,
            country: playerData.info.country,
            nationality: playerData.info.firstNationality,
            height: playerData.info.height === 'Unknown' ? -1 : playerData.info.height,
            weight: playerData.info.weight === 'Unknown' ? -1 : playerData.info.weight,
            real_position: playerData.info.realPosition,
            real_position_side: playerData.info.realPositionSide
        }
        console.log(toInsert)
        const insertedPlayer = await db.insert('players', toInsert)
        console.log('Successfully inserted', player.name)

        for (const game of playerData.info.fixtures) {
            if (game.homeClub !== undefined) {
                const fixture = await db.query('fixtures', { home: game.homeClub, away: game.awayClub, week: game.gameWeek})
                let fixtureId = null
                if (!fixture.length) {
                    const inserted = await db.insert('fixtures', {
                        opta_id: '',
                        away: game.awayClub,
                        home: game.homeClub,
                        away_score: game.awayScore || -1,
                        home_score: game.homeScore || -1,
                        game_date: game.startDate,
                        week: game.gameWeek
                    })
                    fixtureId = inserted.id
                } else {
                    fixtureId = fixture[0].id
                    if (fixture[0].home_score === -1 && game.homeScore !== undefined) {
                        await db.update('fixtures', {id: fixtureId}, {
                            home_score: game.homeScore,
                            away_score: game.awayScore,
                            game_date: game.startDate
                        })
                    }
                }

                const playerStats = {}

                Object.keys(statMapping).forEach(key => {
                    if (statMapping[key] !== 0) {
                        playerStats[statMapping[key]] = game.statObj[key]
                    }
                })

                await db.insert('player_stats', {
                    player_id: insertedPlayer.id,
                    fixture_id: fixtureId,
                    is_home: game.isHome || false,
                    is_starter: game.isStarter || false,
                    ...playerStats
                })

            }
        }
        console.log(player.name, 'complete')

    }
}

doStuff()
