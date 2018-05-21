import * as uuid from 'uuid/v4'
import * as createError from 'http-errors'
import * as Sequelize from 'sequelize'
import models from '../models'
import { createDraft } from '../services/draft'
const { Challenge, ChallengeType, ChallengeDetail, Fixture, Player, Club, sequelize } = models;

export const createChallenge = async (user, title: string, typeId: number) => {
    const challengeId = uuid()
    const randomNumber = Math.floor(1000 + Math.random() * 9000)
    const inviteCode = user.username + randomNumber
    // TODO implement this as a transaction so its rolled back if all of it fails
    try {
        await Challenge.create({
            uuid: challengeId,
            userId: user.id,
            challengeTypeId: typeId,
            isHost: true,
            hasAccepted: true,
            title,
            inviteCode
        })
    } catch (error) {
        console.error(error)
        throw createError(500)
    }
}

export const joinChallenge = async (user, inviteCode: string) => {
    const challenges = await Challenge.findAndCountAll({
        where: {
            inviteCode
        }
    })
    console.log(challenges)
    return true
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

export const listAvailablePlayers = async (challengeId) => {
    const challenge: any = await Challenge.findOne({
        where: {
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

export const endDraft = async (challengeId, draft) => {
    console.log('ENDING', draft)
    const {
        draftedPlayers,
        draftOrder
    } = draft
    const results = {}

    // The below takes two arrays one with the the users in draft order in an array e.g. [1,2,2,1]
    // and the second an array of player ids and converts it to an object where the keys are user ids
    // and the values are arrays of player objects, which have playerId and draftOrder as key/values
    /*
        {
            1: [ { playerId: 172, draftOrder: 0 }],
            2: [ { playerId: 173, draftOrder: 1 }]
        }
    */
    draftOrder.forEach((user, i) => {
        const playerObj = {
            playerId: draftedPlayers[i],
            draftIndex: i
        }
        if (!results[user]) results[user] = [];

        results[user].push(playerObj)
    })

    // this iterates over those keys and inserts them into the ChallengeDetails model
    // NOTE: challengeId here is the uuid, where the pkey on the ChallengeDetail model is the challenge id (not uuid)
    const transaction: Sequelize.Transaction = await sequelize.transaction()

    try {
        const challenges: any = await Challenge.findAll({
            where: {
                uuid: challengeId
            }
        })
        await Promise.all(challenges.map(async challenge => {
            // update the challenge to be done
            await challenge.update({
                draftComplete: true
            }, { transaction })

            // now create the challenge details
            return Promise.all(results[challenge.userId].map(async playerObj => {
                const { playerId, draftIndex } = playerObj
                return ChallengeDetail.create({
                    challengeId: challenge.id,
                    playerId,
                    draftIndex
                }, { transaction })
            }))

        }))
        // if nothing broke, commit the transaction
        return transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}