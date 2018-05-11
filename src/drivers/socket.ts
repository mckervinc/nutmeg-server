import * as jwt from 'jsonwebtoken'
import { getChallenge, createChallenge, flush, joinChallenge, leaveChallenge } from '../services/draft'

const socketHandler = (io: SocketIO.Server) => {

    io.on('connection', async socket => {
        const { challenge, token } = socket.handshake.query
        let user: any
        if (token) {
            user = jwt.verify(token, process.env.JWT_SECRET)
            // const isReady = await joinChallenge(user.id, challenge)
            // if (isReady) {
            //     io.sockets.emit('message', 'ready!!!')
            // }
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

        socket.on('disconnect', () => {
            // if (token) {
            //     leaveChallenge(user.id, challenge)
            // }
            // io.sockets.emit('message', 'not ready!!!')
            console.log('user disconnected')
        })
    })
}

export default socketHandler