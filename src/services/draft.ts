import * as _ from 'lodash'
import { redis } from '../drivers'

export const createChallenge = async (id: string) => {
    redis.hmsetAsync(
        id, [
            'size',
            2
        ]
    )
}

export const joinChallenge = async (userId, challengeId) => {
    await redis.saddAsync(`joined:${challengeId}`, userId)
    const challengeSize = await redis.hgetAsync(challengeId, 'size')
    const challenge = await redis.hgetallAsync(challengeId)
    const members = await getChallengeMembers(challengeId)
    console.log(challenge)
    console.log(challengeSize)
    console.log(members.length)
    // Keeping loose equality for string to integer comparison (redis returns string)
    // tslint:disable-next-line
    if (challengeSize == members.length) {
        return true
    } else {
        return false
    }
}

export const leaveChallenge = async (userId, challengeId) => {
    return redis.sremAsync(`joined:${challengeId}`, userId)
}

export const getChallengeMembers = async (challengeId) => {
    return redis.smembersAsync(`joined:${challengeId}`)
}

export const getChallenge = async (id: string) => {
    const challenge = await redis.hgetallAsync(id)
    return challenge
}

export const flush = async () => {
    await redis.flushdbAsync()
}