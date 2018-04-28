import * as redis from 'redis'
import * as bluebird from 'bluebird'
import * as uuid from 'uuid/v4'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const client = redis.createClient(process.env.REDISCLOUD_URL)

client.on('connect', () => {
    console.log('connected to redis')
});

// export const createGame = (sessionId, dispatcher) => {
//     const gamename = 'game';
//     client.hmsetAsync(
//         gamename, [
//             'player1',
//             sessionId,
//             'player2',
//             ''
//         ]
//     )
//     dispatcher('game', {name: gamename, player: 'player1'}, sessionId)
// }

// export const listGames = async () => {
//     const result = await client.hgetallAsync('game')
//     console.dir(result)
// }

export default client