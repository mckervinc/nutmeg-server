import * as _ from 'lodash'
import { redis } from '../drivers'
const THIRTY_SECONDS = 30000

// SCHEMA
// draft:details:[challengeId] is the draft hash
// draft:lobby:[challengeId] is the draft lobby set
// draft:drafted:[challengeId] is the drafted players set
// draft:user:queue:[challengeId]:[userId] is the player queue list
// draft:user:drafted:[challengeId]:[userId] is the drafted player set

export const createDraft = async (challengeId: string, invitees: number[], availablePlayers) => {
    await redis.hmsetAsync(`draft:details:${challengeId}`, {
            size: invitees.length + 1, // for the invitees + the host
            isLive: 'false',
            isDone: 'false'
        }
    )
    await redis.saddAsync(`draft:available:${challengeId}`, availablePlayers)
}

export const joinDraft = async (userId, challengeId) => {
    // adds a userId to the lobby, returns true if the lobby has all participants
    await redis.saddAsync(`draft:lobby:${challengeId}`, userId)
}

export const leaveDraft = async (userId, challengeId) => {
    return redis.sremAsync(`draft:lobby:${challengeId}`, userId)
}

export const getDraftLobby = async (challengeId) => {
    // returns an array of user ids in the lobby
    return redis.smembersAsync(`draft:lobby:${challengeId}`)
}

export const getDraftDetails = async (challengeId: string, userId = null) => {
    const draft = await redis.hgetallAsync(`draft:details:${challengeId}`)
    const draftedPlayers = await redis.smembersAsync(`draft:drafted:${challengeId}`)
    // gotta convert the draft order array back :( maybe we could use a redis list...
    if (draft.draftOrder) draft.draftOrder = JSON.parse(draft.draftOrder)

    if (userId === null) {
        return {
            ...draft,
            draftedPlayers
        }
    } else {
        const myTeam = await getMyTeam(userId, challengeId)
        const myQueue = await getQueue(userId, challengeId)
        return {
            ...draft,
            draftedPlayers,
            myTeam,
            myQueue
        }
    }
}

export const isDraftReady = async (challengeId: string) => {
    const members = await getDraftLobby(challengeId)
    const challengeSize = await redis.hgetAsync(`draft:details:${challengeId}`, 'size')
    // Keeping loose equality for string to integer comparison (redis returns string)
    // tslint:disable-next-line
    return challengeSize == members.length
}

export const isDraftLive = async (challengeId: string) => {
    const isLive = await redis.hgetAsync(`draft:details:${challengeId}`, 'isLive')
    return isLive === 'true'
}

export const isDraftDone = async (challengeId: string) => {
    const isDone = await redis.hgetAsync(`draft:details:${challengeId}`, 'isDone')
    return isDone === 'true'
}

export const getDraftedPlayers = async (challengeId) => {
    return redis.smembersAsync(`draft:drafted:${challengeId}`)
}

export const isPlayerDrafted = async (challengeId, playerId) => {
    const isDrafted = await redis.sismemberAsync(`draft:drafted:${challengeId}`, playerId)
    console.log('ARE THEY DRAFTED??', isDrafted)
    return isDrafted === 1
}

export const queuePlayer = async (userId, challengeId, playerId) => {
    const queue = await getQueue(userId, challengeId)
    if (!queue.includes(playerId)) {
        await redis.rpushAsync(`draft:user:queue:${challengeId}:${userId}`)
    }
}

export const unqueuePlayer = async (userId, challengeId, playerId) => {
    return redis.lremAsync(`draft:user:queue:${challengeId}:${userId}`, playerId)
}

export const getQueue = async (userId, challengeId) => {
    return redis.lrangeAsync(`draft:user:queue:${challengeId}:${userId}`, 0, -1)
}

export const getMyTeam = async (userId, challengeId) => {
    return redis.smembersAsync(`draft:user:drafted:${challengeId}:${userId}`)
}

export const draftPlayer = async (userId, challengeId, playerId) => {
    const isDrafted = await isPlayerDrafted(challengeId, playerId)
    if (!isDrafted) {
        await redis.saddAsync(`draft:user:drafted:${challengeId}:${userId}`, playerId)
        await redis.saddAsync(`draft:drafted:${challengeId}`, playerId)
    } else {
        throw new Error('Player already taken!')
    }

}

export const autoDraftPlayer = async (userId, challengeId) => {
    const allPlayerIds = await redis.smembersAsync(`draft:available:${challengeId}`)
    const draftedPlayers = await getDraftedPlayers(challengeId)
    const availablePlayers = _.xor(allPlayerIds, draftedPlayers)
    const playerId = _.sample(availablePlayers)
    return draftPlayer(userId, challengeId, playerId)
}

export const startDraft = async (challengeId: string) => {
    if (await isDraftReady(challengeId)) {
        const members = await getDraftLobby(challengeId)
        const draftOrder = randomizeDraftOrder(members, 3) // for now its only 3 picks, we can change it later
        const startPayload = {
            draftOrder: JSON.stringify(draftOrder),
            draftIndex: 0,
            turnEnd: Date.now() + THIRTY_SECONDS,
            isLive: 'true'
        }
        await redis.hmsetAsync(`draft:details:${challengeId}`, startPayload)
        return startPayload

    }
}

export const incrementDraftIndex = async (challengeId: string) => {
    await redis.hincrby(`draft:details:${challengeId}`, 'draftIndex', 1)
}

export const endTurn = async (userId, challengeId, playerId) => {
    const draft = await getDraftDetails(challengeId)
    const currentlyDrafting = draft.draftOrder[draft.draftIndex]
    // tslint:disable-next-line
    if (currentlyDrafting == userId) {
        if (playerId) {
            await draftPlayer(userId, challengeId, playerId)
            await incrementDraftIndex(challengeId)
        } else {
            await autoDraftPlayer(userId, challengeId)
            await incrementDraftIndex(challengeId)
        }
        return true
    } else {
        console.log('not yo turn!!!')
        return false
        // if (Date.now() > parseInt(draft.timeEnd, 10)) {
        //     await autoDraftPlayer(currentlyDrafting, challengeId)
        // }
    }
}

export const endDraft = async (challengeId) => {
    await redis.hmsetAsync(`draft:details:${challengeId}`, {
        isLive: 'false',
        isDone: 'true'
    })
}

export const flush = async () => {
    await redis.flushdbAsync()
}

const randomizeDraftOrder = (choices, numDrafts) => {
    const randomized = _.shuffle(choices)
    const draftOrder = new Array(numDrafts).fill(0)
    return _.flatten(draftOrder.map((value, index) => {
        return index % 2 ? randomized : randomized.slice().reverse()
    }))
}