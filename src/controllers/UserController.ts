import Controller from './Controller';
import db from '../services/db';

const controller = new Controller()

controller.addRoute({
    method: 'get',
    route: '/users',
    callback: async (params) => {
        return await db.query('users')
    }
})

controller.addRoute({
    method: 'get',
    route: '/users/:id',
    callback: async (params) => {
        return await db.query('users', { id: params.id })
    }
})

controller.addRoute({
    method: 'post',
    route: '/users',
    callback: async (params) => {
        return await db.insert('users', params)
    }
})

export default controller