const controller = require('../controllers/user');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.post('/user/account/create', auth.requireNoUser, controller.routeCreateUser);
	router.post('/user/account/password', auth.requireUser, controller.routeChangeUserPassword);

	router.post('/user/login', auth.requireNoUser, controller.routeLoginUser);
	router.post('/user/logout', [auth.requireUser, auth.clearUserInfoCookies], controller.routeLogoutUser);

};