import Controller from './controller'
import * as ClubService from '../services/club'
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
            withPlayers
        } = params

        if (id) {
            return ClubService.findById(id, withPlayers)
        }
        if (optaId) {
            return ClubService.findByOptaId(optaId)
        }
        if (name) {
            return ClubService.findByName(name)
        }

        return ClubService.findAll(withPlayers)
    }
})

export default controller