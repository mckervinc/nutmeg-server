import Controller from './Controller'
import ChallengeService from '../services/ChallengeService'

const controller = new Controller()

controller.addRoute({
    method: 'post',
    route: '/create',
    callback: async (params, req, res) => {
        return await ChallengeService.createChallenge(req.user.id, params.typeId, [1])
    }
})

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params, req, res) => {
        return await ChallengeService.listChallenges(req.user.id)
    }
})

export default controller