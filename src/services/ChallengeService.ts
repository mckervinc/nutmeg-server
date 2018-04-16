import { db } from '../drivers'
import * as uuid from 'uuid/v4'

class ChallengeService {
    private challenges
    constructor() {
        this.challenges = 'challenges'
    }

    async createChallenge(hostId, typeId, invitees) {
        const challengeId = uuid()
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
                invitees.map(id => {
                    return db.insert(this.challenges, {
                        id: challengeId,
                        user_id: id,
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