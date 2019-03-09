const controller = require('../controllers/user');

module.exports.registerRoutes = (router) => {

	router.post('/user/account/create', controller.routeCreateUser);
	router.post('/user/account/password', controller.routeChangeUserPassword);

	router.post('/user/login', controller.routeLoginUser);
	router.post('/user/logout', controller.routeLogoutUser);

};