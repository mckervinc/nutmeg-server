import * as uuid from 'uuid/v4'
import { Challenge } from '../models'
import * as createError from 'http-errors'
import * as Sequelize from 'sequelize';

export const createChallenge = async (hostId: number, typeId: number, invitees: number[]) => {
    const challengeId = uuid()
    // TODO implement this as a transaction so its rolled back if all of it fails
    try {
        await Challenge.create({
            uuid: challengeId,
            userId: hostId,
            challengeTypeId: typeId,
            isHost: true,
            hasAccepted: true
        })
        await Promise.all(
            invitees.map(async inviteeId => {
                return Challenge.create({
                    uuid: challengeId,
                    userId: inviteeId,
                    challengeTypeId: typeId
                })
            })
        )
        return { challengeId }
    } catch (error) {
        throw createError(500)
    }
}

export const listChallengesByUser = async (userId) => {
    return Challenge.findAll({
        where: { userId }
    })
}

export const acceptChallenge = async (userId, challengeId) => {
    const challenge: any = await Challenge.findOne({
        where: {
            uuid: challengeId,
            userId
        }
    })
    challenge.update({
        where: {
            hasAccepted: true
        }
    })
}