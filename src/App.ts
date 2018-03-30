import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as expressValidator from 'express-validator';
import * as createError from 'http-errors';
import * as errorHandler from 'errorhandler';
import * as logger from 'morgan';
import UserController from './controllers/UserController'
import { create } from 'domain';
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
        if (process.env.DEV) {
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
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World'
            })
        })

        this.express.use('/', router)
        this.express.use('/', UserController.configure())
    }

    private mountErrorHandlers(): void {
        const app = this.express
        // 404 route handler
        app.use((req, res, next) => {
            next(createError(404))
        })

        // error handler
        app.use((err, req, res, next) => {
            const error: Response = {
                status: err.status || 500,
                message: err.message || 'Server error'
            }

            res.status(error.status).json(error)
        })
    }
}

export default new App().express