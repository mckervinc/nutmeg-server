import { db } from '../drivers'
import * as uuid from 'uuid/v4'
import UserService from './UserService'

class ChallengeService {
    private challenges
    constructor() {
        this.challenges = 'challenges'
    }

    async createChallenge(hostId, typeId, invitees) {
        const challengeId = uuid()
        /// error checking on number of invitees
        // TODO implement this as a transaction so its rolled back if all of it fails
        try {
            await db.insert(this.challenges, {
                id: challengeId,
                user_id: hostId,
                challenge_type_id: typeId,
                is_host: true,
                has_accepted: true
            })
            await Promise.all(
                invitees.map(async username => {
                    const userInfo = await UserService.findOne({ username })
                    return db.insert(this.challenges, {
                        id: challengeId,
                        user_id: userInfo.id,
                        challenge_type_id: typeId,
                        is_host: false,
                        has_accepted: false,
                    })
                })
            )
        } catch (error) {
            throw error
        }
        return challengeId
    }

    async acceptChallenge(userId, challengeId) {
        await db.update(this.challenges, {
            id: challengeId,
            user_id: userId,
        }, {
            has_accepted: true
        })
    }

    async listChallenges(userId) {
        return await db.query(this.challenges, {
            user_id: userId
        })
    }
}

export default new ChallengeService()