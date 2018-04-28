const socketHandler = (io: SocketIO.Server) => {

    io.on('connection', socket => {
        console.log('user connected', socket.id)
        socket.on('message', msg => {
            console.log(msg)
            io.emit('message', msg)
        })

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}

export default socketHandler