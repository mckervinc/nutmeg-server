import Controller from './controller';
import * as UserService from '../services/user'

const controller = new Controller()

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params) => {
        const { search } = params
        if (search) {
            return UserService.findByUsernameOrEmail(search)
        }
    }
})

export default controller