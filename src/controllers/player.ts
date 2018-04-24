import Controller from './controller'
import * as PlayerService from '../services/player'
import * as createError from 'http-errors'

const controller = new Controller();

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params) => {
        if (params.id) {
            const player: any = await PlayerService.findById(params.id)
            return player
        }
        if (params.optaId) {
            return await PlayerService.findByOptaId(params.optaId)
        }
        throw createError(400)
    }
})

controller.addRoute({
    method: 'get',
    route: '/stats',
    callback: async (params) => {
        if (params.id) {
            return PlayerService.findStatsById(params.id)
        }

        throw createError(400)
    }
})

export default controller