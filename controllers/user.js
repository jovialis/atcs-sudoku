const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports.routeLoginUser = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		res.status(400).send('No username or password provided');
		return;
	}

	const User = mongoose.model('User');
	User.findOne({
		username: username.toLowerCase()
	}).then(doc => {
		if (!doc) {
			res.status(404).send({
				error: 'No such user'
			});
			return;
		}

		// Check if the password is valid
		bcrypt.compare(password, doc.hash).then(result => {
			if (result === true) {
				// Successfully authenticated. Time to set our session variable
				req.session.user = doc;
				res.json({
					success: true,
					user: {
						username: doc.username,
						name: doc.name
					}
				});
			} else {
				req.session.user = undefined;
				res.status(401).json({
					success: false
				});
			}
		}).catch(err => {
			res.status(500).send('An internal error occurred');
			console.log(err);
		});
	}).catch(err => {
		res.status(500).send('An internal error occurred');
		console.log(err);
	});
};

module.exports.routeLogoutUser = (req, res) => {
	req.session.user = undefined;
	res.send('Logged out');
};

module.exports.routeCreateUser = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		res.status(400).send('No username or password provided');
		return;
	}

	const User = mongoose.model('User');
	User.findOne({
		username: username.toLowerCase()
	}).then(doc => {
		if (doc) {
			res.status(409).send({
				error: 'Account already created'
			});
			return;
		}

		// Generate our password hash
		bcrypt.hash(password, Number(process.env.HASH_ROUNDS)).then(hash => {
			User.create({
				name: username,
				username: username.toLowerCase(),
				hash: hash
			}).then(doc => {
				req.session.user = doc;
				res.send({
					success: true,
					user: {
						username: doc.username,
						name: doc.name
					}
				});
			}).catch(err => {
				res.status(500).send('An internal error occurred');
				console.log(err);
			});
		}).catch(err => {
			res.status(500).send('An internal error occurred');
			console.log(err);
		})
	}).catch(err => {
		res.status(500).send('An internal error occurred');
		console.log(err);
	});
};

module.exports.routeChangeUserPassword = (req, res) => {
	const username = req.body.username;
	const oldPassword = req.body.password.old;
	const newPassword = req.body.password.new;

	if (!username || !oldPassword || !newPassword) {
		res.status(400).send('No username or password provided');
		return;
	}

	const User = mongoose.model('User');
	User.findOne({
		username: username.toLowerCase()
	}).then(doc => {
		if (!doc) {
			res.status(404).send({
				error: 'No such user'
			});
			return;
		}

		// Check if the old password is valid
		bcrypt.compare(oldPassword, doc.hash).then(result => {
			if (result === true) {
				// Old password is valid. Now we have to generate a new hash.
				bcrypt.hash(newPassword, process.env.HASH_ROUNDS).then(hash => {
					// Set the new hash
					doc.hash = hash;
					// Save the document
					doc.save().then(() => {
						// Set the session user again so it has the proper pass hash.
						req.session.user = doc;
						res.json({
							success: true,
						});
					}).catch(err => {
						result.status(500).send('An internal error occurred');
						console.log(err);
					});
				}).catch(err => {
					result.status(500).send('An internal error occurred');
					console.log(err);
				});
			} else {
				result.status(403).send('Invalid password provided');
			}
		}).catch(err => {
			res.status(500).send('An internal error occurred');
			console.log(err);
		})
	}).catch(err => {
		res.status(500).send('An internal error occurred');
		console.log(err);
	});
};