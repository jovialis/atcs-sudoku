const mongoose = require('mongoose');
const uuid = require('uuid/v3');

mongoose.model('User', new mongoose.Schema({
	pin: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
	}
}, {
	collection: 'users'
}));