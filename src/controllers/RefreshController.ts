import Controller from './Controller'
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'

const controller = new Controller()

controller.addRoute({
    method: 'get',
    route: '/',
    callback: (params, req, res) => {
        if (req.user) {
            const user = _.pick(req.user, [
                'id',
                'first_name',
                'last_name',
                'email',
                'username'
            ])
            return jwt.sign(user, process.env.JWT_SECRET)
        }
    }
})

export default controller