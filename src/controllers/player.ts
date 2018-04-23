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
            console.log(player.get({plain: true}))
            return player.get({plain: true})
        }
        if (params.opta_id) {
            return await PlayerService.findByOptaId(params.opta_id)
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