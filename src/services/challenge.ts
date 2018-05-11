import * as uuid from 'uuid/v4'
import models from '../models'
import * as createError from 'http-errors'

const { Challenge, ChallengeType, Fixture, Player, Club } = models;

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
        console.error(error)
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

export const listAvailablePlayers = async (userId, challengeId) => {
    const challenge: any = await Challenge.findOne({
        where: {
            userId,
            uuid: challengeId
        },
        include: [{
            model: ChallengeType,
            include: [{
                model: Fixture,
                include: [
                    {
                        model: Club,
                        as: 'home',
                        include: [Player]
                    },
                    {
                        model: Club,
                        as: 'away',
                        include: [Player]
                    }
                ]
            }]
        }],
    })
    return challenge.challenge_type.fixture.home.players.concat(challenge.challenge_type.fixture.away.players)
}