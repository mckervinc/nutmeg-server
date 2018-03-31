import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as createError from 'http-errors';
import * as errorHandler from 'errorhandler';
import * as logger from 'morgan';
import {
    UserController,
    PublicController
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
    }

    private mountRoutes(): void {
        const router = express.Router()

        this.express.use('/', UserController.configure());
        this.express.use('/', PublicController.configure());
    }

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