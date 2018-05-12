import * as jwt from 'jsonwebtoken'
import { getChallenge, createChallenge, flush, joinChallenge, leaveChallenge } from '../services/draft'

const socketHandler = (io: SocketIO.Server) => {

    io.on('connection', async socket => {
        const { challenge, token } = socket.handshake.query
        let user: any
        if (token) {
            user = jwt.verify(token, process.env.JWT_SECRET)
            const isReady = await joinChallenge(user.id, challenge)
            if (isReady) {
                console.log(challenge, 'is ready')
            }
            console.log('user connected', user.id)
        } else {
            console.log('test user connected')
        }
        socket.join(challenge)

        socket.on('message', msg => {
            if (msg === 'flush') {
                return flush()
            }
            io.to(challenge).emit('message', `${user.username}: ${msg}`)
        })

        socket.on('PLAYER_DRAFT', obj => {
            io.to(challenge).emit('PLAYER_DRAFT', {
                user,
                ...obj
            })
        })

        socket.on('disconnect', () => {
            if (token) {
                leaveChallenge(user.id, challenge)
            }
            console.log('not ready')
            console.log('user disconnected', user.id || '')
        })
    })
}

export default socketHandler