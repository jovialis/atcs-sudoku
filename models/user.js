const mongoose = require('mongoose');
const uuid = require('uuid/v3');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true
	},
	hash: {
		type: String,
		required: true
	}
}, {
	collection: 'users'
});

mongoose.model('User', userSchema);