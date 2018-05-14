import * as jwt from 'jsonwebtoken'
import * as draftServices from '../services/draft'
import { redis } from '.';

const socketHandler = (io: SocketIO.Server) => {

    io.on('connection', async socket => {
        const { challengeId, token } = socket.handshake.query
        if (token) {
            // Means we have a mobile client connecting (not the debug service)
            const user = verifyToken(token)

            if (challengeId) {
                draftHandler(user, challengeId, socket, io)
            }
        } else {
            console.log('Debug user connected')
        }

        socket.on('message', async msg => {
            // debug here
        })

    })
}

const draftHandler = async (user, challengeId, socket, io) => {
    console.log(user.username, 'connected')
    socket.join(challengeId)
    await draftServices.joinDraft(user.id, challengeId)
    // we need to include some logic to send a payload back
    if (await draftServices.isDraftDone(challengeId)) {
        // should never get here... but push them back if needed
        io.to(challengeId).emit('DRAFT_END')
    } else if (await draftServices.isDraftLive(challengeId)) {
        const draft = await draftServices.getDraftDetails(challengeId, user.id)
        socket.emit('NEXT_TURN', draft)
    } else if (await draftServices.isDraftReady(challengeId)) {
        io.to(challengeId).emit('DRAFT_READY')
    }

    socket.on('chat', msg => {
        io.to(challengeId).emit('chat', `${user.username}: ${msg}`)
    })

    socket.on('QUEUE_PLAYER', async playerId => {
        // STUB
        // await draftServices.queuePlayer(user.id, challengeId, playerId)
        // socket.emit()
    })

    socket.on('UNQUEUE_PLAYER', () => {
        // STUB
    })

    socket.on('DRAFT_START', async () => {
        await draftServices.startDraft(challengeId)
        const draft = await draftServices.getDraftDetails(challengeId)
        io.to(challengeId).emit('NEXT_TURN', draft)
        // double check if the draft is ready, then set redis to live
        // randomize order + start timer
        // emit the draft start to everyone
    })

    socket.on('DONE_TURN', async (playerId) => {
        // this should send an event that starts timers on everyone's device
        let isTurnOver
        try {
            isTurnOver = await draftServices.endTurn(user.id, challengeId, playerId)
            if (isTurnOver) {
                const draft = await draftServices.getDraftDetails(challengeId, user.id)
                if (draft.draftIndex >= draft.draftOrder.length) {
                    await draftServices.endDraft(challengeId)
                    io.to(challengeId).emit('DRAFT_END')
                } else {
                    io.to(challengeId).emit('NEXT_TURN', draft)
                }
            } else {
                socket.emit('ERROR', 'Woah not your turn')

            }
        } catch (error) {
            socket.emit('ERROR', 'Woah he\'s already been drafted')
        }
    })

    socket.on('disconnect', async () => {
        await draftServices.leaveDraft(user.id, challengeId)
        console.log(`${user.username} has left the lobby, ${challengeId} is not ready`)
        io.to(challengeId).emit('DRAFT_UNREADY')
        // if (await draftServices.isDraftLive(challengeId)) {
        //     setTimeout(
        // }
        // if the draft is live, set a timeout for this person's turn to end 1 second after the limit
        // if the draft is live and nobody is in the game
        // start a sequence to autodraft everything. then once someone joins, reset... but this is a really 'rare' edge case)
    })

}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)

}

export default socketHandler
