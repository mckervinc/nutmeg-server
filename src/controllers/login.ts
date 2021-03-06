import Controller from './controller';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as createError from 'http-errors'
import * as _ from 'lodash'

const controller = new Controller()

controller.addRoute({
    method: 'post',
    route: '/',
    callback: (params, req, res) => {
        const user = _.pick(req.user, [
            'id',
            'firstName',
            'lastName',
            'email',
            'username'
        ])
        console.log(user)
        return jwt.sign(user, process.env.JWT_SECRET)
    }
})

export default controller