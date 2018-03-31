import Controller from './Controller';

const controller = new Controller();

controller.addRoute({
  method: 'get',
  route: '/hello',
  callback: (params) => {
    return 'Hello world!'
  }
});

controller.addRoute({
    method: 'get',
    route: '/',
    callback: (params) => {
        return 'Success'
    }
})

export default controller;
