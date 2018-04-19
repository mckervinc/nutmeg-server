import Controller from './Controller'
import ChallengeService from '../services/ChallengeService'

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
        return ChallengeService.listChallenges(req.user.id)
    }
})

export default controller