import * as dotenv from 'dotenv'
dotenv.config()
import app from './App';
import * as http from 'http';
import * as socketIo from 'socket.io'

const port = process.env.PORT || 3000;
const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

const server = http.createServer(app)
// binding the socket server
const io = socketIo(server)

io.on('connection', socket => {
    socket.on('message', msg => {
        io.emit('message', msg)
    })
})
server.listen(port);
server.on('error', onError)
server.on('listening', onListening)

export default io