import Controller from './controller'
import * as PlayerService from '../services/player'
import * as createError from 'http-errors'

const controller = new Controller();

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params) => {
        const {
            id,
            optaId,
            name,
            position
        } = params

        if (id) {
            return PlayerService.findById(id)
        }
        if (optaId) {
            return PlayerService.findByOptaId(optaId)
        }
        if (name) {
            return PlayerService.findByName(name)
        }
        if (position) {
            return PlayerService.findByPosition(position)
        }
        return PlayerService.findAll()
    }
})

controller.addRoute({
    method: 'get',
    route: '/stats',
    callback: async (params) => {
        const {
            id,
        } = params

        if (id) {
            return PlayerService.findStatsById(id)
        }
        throw createError(400, 'You must provide a player id')
    }
})

export default controller