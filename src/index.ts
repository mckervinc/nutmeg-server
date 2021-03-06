import * as dotenv from 'dotenv'
dotenv.config()
import * as http from 'http';
import * as socketIo from 'socket.io'
import * as redisAdapter from 'socket.io-redis'
import app from './App';
import socketHandler from './drivers/socket'
import models from './models'

// SENTRY CONFIG
declare global {
    namespace NodeJS {
        interface Global {
            __rootdir__: string;
        }
    }
}

global.__rootdir__ = __dirname || process.cwd();

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
io.adapter(redisAdapter(process.env.REDISCLOUD_URL))

socketHandler(io)

server.listen(port);
server.on('error', onError)
server.on('listening', onListening)

export default io