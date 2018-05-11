import * as _ from 'lodash'
import { redis } from '../drivers'

export const createChallenge = async (id: string) => {
    redis.hmsetAsync(
        id, [
            'joined',
            '',
            'size',
            2
        ]
    )
}

export const joinChallenge = async (userId, challengeId) => {
    const challenge = await redis.hgetallAsync(challengeId)
    if (challenge.joined) {
        const joined = challenge.joined.split(',')
        joined.push(userId)
        await redis.hmsetAsync(
            challengeId, [
                'joined',
                joined.join(',')
            ]
        )
        return joined.length === parseInt(challenge.size, 10)

    } else {
        await redis.hmsetAsync(
            challengeId, [
                'joined',
                userId
            ]
        )
        return false
    }
}

export const leaveChallenge = async (userId, challengeId) => {
    const challenge = await redis.hgetallAsync(challengeId)
    if (challenge.joined) {
        return redis.hmsetAsync(
            challengeId, [
                'joined',
                _.pull(challenge.joined.split(','), String(userId)).join(',')
            ]
        )
    }
}

export const getChallenge = async (id: string) => {
    const result = await redis.hgetallAsync(id)
    console.dir(result)
}

export const flush = async () => {
    await redis.flushdbAsync()
}