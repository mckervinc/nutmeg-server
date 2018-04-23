import Controller from './controller'
import * as ChallengeService from '../services/challenge'

const controller = new Controller()

controller.addRoute({
    method: 'post',
    route: '/create',
    callback: async (params, req, res) => {
        return ChallengeService.createChallenge(req.user.id, params.typeId, params.invitees)
    }
})

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params, req, res) => {
        return ChallengeService.listChallengesByUser(req.user.id)
    }
})

export default controller