const controller = require('../controllers/user');

module.exports.registerRoutes = (router) => {

	// Validate the user's legacy token or generate a new one
	router.post('/user/refresh', controller.routeAuthenticateUserToken);

	// Login with a user's PIN code
	router.post('/user/login', controller.routeLoginUser);

};