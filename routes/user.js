const controller = require('../controllers/user');

module.exports.registerRoutes = (router) => {

	// Check whether the user has a session
	router.post('/user/validate', controller.routeValidateSession);

	router.post('/user/account/create', controller.routeCreateUser);
	router.post('/user/account/password', controller.routeChangeUserPassword);

	router.post('/user/login', controller.routeLoginUser);
	router.post('/user/logout', controller.routeLogoutUser);

};