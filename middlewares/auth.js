const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports.requireUser = (req, res, next) => {
	if (!req.session.user) {
		res.status(401).send('Authentication required');
		next('Authentication required');
	} else {
		next();
	}
};

module.exports.requireNoUser = (req, res, next) => {
	if (req.session.user) {
		res.status(401).send('You may not be logged in');
		next('Logged out user required');
	} else {
		next();
	}
};

module.exports.redirectIfNoUser = (url) => {
	return (req, res, next) => {
		if (!req.session.user) {
			res.redirect(url);
		} else {
			next();
		}
	};
};

module.exports.redirectIfUser = (url) => {
	return (req, res, next) => {
		if (req.session.user) {
			res.redirect(url);
		} else {
			next();
		}
	};
};

module.exports.userInfoCookies = (req, res, next) => {
	const user = req.session.user;

	res.cookie('username', user.username);
	res.cookie('name', user.name);

	next();
};

module.exports.clearUserInfoCookies = (req, res, next) => {
	res.clearCookie('username');
	res.clearCookie('name');

	next();
};