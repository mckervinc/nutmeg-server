import Controller from './controller';
import * as UserService from '../services/user'
import io from '../'
import * as createError from 'http-errors'
import * as _ from 'lodash'
import * as jwt from 'jsonwebtoken'
const controller = new Controller();

controller.addRoute({
    method: 'get',
    route: '/hello',
    callback: (params, req, res) => {
        return 'Hello'
    }
});

controller.addRoute({
    method: 'get',
    route: '/',
    callback: (params) => {
        return 'Success'
    }
})

controller.addRoute({
    method: 'post',
    route: '/create',
    callback: async (params) => {
        const newUser = await UserService.createUser(params)
        const user = _.pick(newUser, [
            'id',
            'first_name',
            'last_name',
            'email',
            'username'
        ])
        return jwt.sign(user, process.env.JWT_SECRET)
    }
})

controller.addRoute({
    method: 'post',
    route: '/megaphone',
    callback: (params) => {
        if (!params.message) throw createError(400, 'You must pass a message param');

        io.emit('message', params.message)

        return 'Sent message: ' + params.message
    }
})

export default controller;
