const mongoose = require('mongoose');

const User = mongoose.model('User');
const Session = mongoose.model('Session');

module.exports.requireUser = (req, res, next) => {
	if (req.session.user === undefined) {
		res.status(401).send('Authentication required');
		next('Authentication required');
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