import * as redis from 'redis'
import * as Bluebird from 'bluebird'
import * as uuid from 'uuid/v4'

interface RedisPromise extends redis.RedisClient {
    [x: string]: any
}

const client = redis.createClient(process.env.REDISCLOUD_URL)
client.on('connect', () => {
    console.log('Connected to redis')
});
Bluebird.promisifyAll(client)

export default client as RedisPromise