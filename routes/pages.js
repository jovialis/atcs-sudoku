const path = require('path');

module.exports.registerRoutes = (router) => {

	router.get('/account', (req, res) => {
		res.sendFile(path.join(__dirname, '../public/account.html'));
	});

	router.get('/account/join', (req, res) => {
		res.sendFile(path.join(__dirname, '../public/join.html'));
	});

	router.get('/account/login', (req, res) => {
		res.sendFile(path.join(__dirname, '../public/login.html'));
	});

	// Serve index file in all other cases
	router.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../public/index.html'));
	});

};