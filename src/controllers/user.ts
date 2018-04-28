import Controller from './controller';
import * as UserService from '../services/user'

const controller = new Controller()

controller.addRoute({
    method: 'get',
    route: '/',
    callback: async (params) => {
        return UserService.listFriends()
    }
})

export default controller