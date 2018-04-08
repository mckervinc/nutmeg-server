import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as createError from 'http-errors';
import * as errorHandler from 'errorhandler';
import * as logger from 'morgan';
import * as passport from 'passport';
import {
    Strategy as LocalStrategy
} from 'passport-local';
import {
    Strategy as JwtStrategy,
    ExtractJwt
} from 'passport-jwt'
import AuthService from './services/AuthService'
import {
    UserController,
    PublicController,
    LoginController,
    PlayerController
} from './controllers'
import {
    Response
} from './framework'

class App {
    public express

    constructor() {
        this.express = express()
        this.config()
        this.mountRoutes()
        this.mountErrorHandlers()
    }

    /*
    * MIDDLEWARE CONFIG
    */

    private config(): void {
        const app = this.express
        // Configuring middleware
        if (process.env.NODE_ENV === 'development') {
            app.use(errorHandler())
            app.use(logger('dev'))
        } else {
            app.use(logger('short'))
        }
        app.use(compression())
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))

        // Configuring the local strategy to get the JWT
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, AuthService.local))
        // Configuring the jwt strategy for every protected route
        passport.use(new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, AuthService.jwt))

        app.use(passport.initialize())
    }

    /*
    * ADD ROUTE MOUNTING LOGIC BELOW
    */

    private mountRoutes(): void {
        const router = express.Router()

        this.express.use('/users', passport.authenticate('jwt', {session: false} ), UserController.configure());
        this.express.use('/', PublicController.configure());
        this.express.use('/login', passport.authenticate('local', {session: false}), LoginController.configure())
        this.express.use('/players', passport.authenticate('jwt', {session: false}), PlayerController.configure())
        this.express.get('/socket', (req, res) => {
            res.send(socketTest)
        })
    }

    /*
    * ROUTE RESOLUTION + ERROR HANDLING
    */

    private mountErrorHandlers(): void {
        const app = this.express
        // fitting the schema and 404 route handler
        app.use((req, res, next) => {
            if (res.locals.response) {
                const response: Response = {
                    status: 200,
                    data: res.locals.response
                }
                res.status(response.status).json(response)
            } else {
                // should never get here unless the route was not found
                next(createError(404))
            }

        })

        // error handler
        app.use((err, req, res, next) => {
            const error: Response = {
                status: err.status || 500,
                message: err.message || err || 'Server error'
            }

            res.status(error.status).json(error)
        })
    }
}

export default new App().express

const socketTest = `
<!doctype html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
   <script>
  $(function () {
    var socket = io();
    $('form').submit(function(){
      socket.emit('message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
  });
</script>
  </head>
  <body>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
`