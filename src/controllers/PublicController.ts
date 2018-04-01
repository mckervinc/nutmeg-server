import Controller from './Controller';
import UserService from '../services/UserService'
import io from '../'
import * as createError from 'http-errors'
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
        return await UserService.createUser(params)
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
