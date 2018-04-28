import { Route } from '../framework'
import { Router } from 'express'
// A controller is just a collection of routes
class Controller {
    public routes: Route[];

    constructor() {
        this.routes = []
    }

    addRoute(route: Route) {
        this.routes.push(route)
    }

    configure(): Router {
        const router = Router()
        this.routes.forEach(route => {
            router[route.method](route.route, async (req, res, next) => {
                const params = {
                    ...req.params,
                    ...req.query,
                    ...req.body
                }

                // store the output of our controllers (whether its a promise or not handle it)
                try {
                    res.locals.response = await Promise.resolve().then(() => route.callback(params, req, res))
                } catch (err) {
                    next(err)
                }
                next()
            })
        })
        return router;
    }
}

export default Controller