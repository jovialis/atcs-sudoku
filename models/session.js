const mongoose = require('mongoose');
const uuid = require('uuid/v4');

mongoose.model('Session', new mongoose.Schema({
	token: {
		type: String,
		default: uuid
	},
	user: {
		type: 'ObjectId',
		ref: 'User',
		required: true
	}
}, {
	collection: 'sessions'
}));