import Controller from './controller'
import * as ChallengeService from '../services/challenge'

const controller = new Controller()

controller.addRoute({
    method: 'post',
    route: '/create',
    callback: async (params, req, res) => {
        return ChallengeService.createChallenge(req.user, params.title, params.typeId)
    }
})

controller.addRoute({
    method: 'post',
    route: '/join',
    callback: async (params, req, res) => {
        return ChallengeService.joinChallenge(req.user, params.inviteCode)
    }
})

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params, req, res) => {
        if (params.id) {
            return ChallengeService.listAvailablePlayers(params.id)
        }
        return ChallengeService.listChallengesByUser(req.user.id)
    }
})

export default controller