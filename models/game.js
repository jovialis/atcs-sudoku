const mongoose = require('mongoose');
const uuid = require('uuid/v3');

const sessionSchema = new mongoose.Schema({
	token: {
		type: String,
		default: uuid
	},
	user: {
		type: 'ObjectId',
		ref: 'User',
		required: true
	},
	puzzle: {
		type: 'ObjectId',
		ref: 'Puzzle',
		required: true
	},
	start: {
		type: Date,
		default: Date
	},
	finish: {
		type: Date,
		default: null,
	},
	completed: {
		type: Boolean,
		default: false
	},
	forfeited: {
		type: Boolean,
		default: false
	},
	attempts: {
		type: Number,
		default: 0
	}
}, {
	collection: 'sessions'
});

mongoose.model('Game', sessionSchema);