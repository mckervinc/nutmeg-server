import Controller from './Controller'

const controller = new Controller()

controller.addRoute({
    method: 'get',
    route: '/',
    callback: (params, req, res) => {
        if (req.user) return 'Success'
    }
})

export default controller