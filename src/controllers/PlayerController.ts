import Controller from './Controller'
import PlayerService from '../services/PlayerService'
import * as createError from 'http-errors'

const controller = new Controller();

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params) => {
        if (params.id) {
            return await PlayerService.getPlayerDetails(params.id)
        }
        if (params.opta_id) {
            return await PlayerService.getByOptaId(params.opta_id)
        }
        throw createError(400)
    }
})

controller.addRoute({
    method: 'get',
    route: '/stats',
    callback: async (params) => {
        if (params.id) {
            return await PlayerService.getPlayerStats(params.id)
        }

        throw createError(400)
    }
})

export default controller