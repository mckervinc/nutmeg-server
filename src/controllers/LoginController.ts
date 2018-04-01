import Controller from './Controller';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as createError from 'http-errors'

const controller = new Controller()

controller.addRoute({
    method: 'post',
    route: '/',
    callback: (params, req, res) => {
        const user = {
            ...req.user
        }
        return jwt.sign(user, process.env.JWT_SECRET)
    }
})

export default controller