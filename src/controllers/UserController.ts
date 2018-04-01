import Controller from './Controller';
import db from '../drivers/db';
import UserService from '../services/UserService'

const controller = new Controller()

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params) => {
        return await db.query('users')
    }
})

controller.addRoute({
    method: 'get',
    route: '/:id',
    callback: async (params) => {
        return await db.query('users', {
            id: params.id
        })
    }
})

controller.addRoute({
    method: 'delete',
    route: '/:id',
    callback: async (params) => {
        return await db.delete('users', {
            id: params.id
        })
    }
})

export default controller