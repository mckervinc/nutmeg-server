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
            router[route.method](route.route, route.callback)
        })
        return router;
    }
}

export default Controller