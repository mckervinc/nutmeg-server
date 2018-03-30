import Controller from './Controller';

const controller = new Controller()

controller.addRoute({
    method: 'get',
    route: '/users',
    callback: (req, res, next) => {
        res.send('hi')
    }
})

export default controller