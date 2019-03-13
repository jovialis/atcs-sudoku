const path = require('path');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.get('/account', [auth.redirectIfNoUser('/account/login'), auth.userInfoCookies], (req, res) => {
		res.sendFile(path.join(__dirname, '../public/account.html'));
	});

	router.get('/account/join', auth.redirectIfUser('/account'), (req, res) => {
		res.sendFile(path.join(__dirname, '../public/join.html'));
	});

	router.get('/account/login', [auth.redirectIfUser('/account'), auth.clearUserInfoCookies], (req, res) => {
		res.sendFile(path.join(__dirname, '../public/login.html'));
	});

	// router.get('/', [auth.redirectIfNoUser('/account/login'), auth.userInfoCookies], (req, res) => {
	// 	const id = req.param('id');
	//
	// 	res.cookie('puzzle', user.username);
	//
	// 	res.sendFile(path.join(__dirname, '../public/game.html'));
	// });

	// Serve game file in all other cases
	router.get('*', [auth.redirectIfNoUser('/account/login'), auth.userInfoCookies], (req, res) => {
		res.sendFile(path.join(__dirname, '../public/game.html'));
	});

};