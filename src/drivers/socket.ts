const socketHandler = (io: SocketIO.Server) => {

    io.on('connection', socket => {
        console.log('user connected', socket.id)
        const challenge = socket.handshake.query.challenge
        socket.join(challenge)
        socket.on('message', msg => {
            console.log(challenge)
            io.to(challenge).emit('message', msg)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}

export default socketHandler