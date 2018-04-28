import Controller from './controller'
import * as FixtureService from '../services/fixture'
import * as createError from 'http-errors'

const controller = new Controller();

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params) => {
        const {
            id,
            optaId,
        } = params

        if (id) {
            return FixtureService.findById(id)
        }
        if (optaId) {
            return FixtureService.findByOptaId(optaId)
        }
        // todo find by date
        return FixtureService.findAll()
    }
})

export default controller