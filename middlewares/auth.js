const mongoose = require('mongoose');

const User = mongoose.model('User');
const Session = mongoose.model('Session');

module.exports.requireUser = async (req, res, next) => {
	if (req.session.user === undefined) {
		res.status(401).send('Authentication required');
		next('Authentication required');
	} else {
		next();
	}
};