const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const sessionSchema = new mongoose.Schema({
	token: {
		type: String,
		default: uuid
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	puzzle: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Puzzle',
		required: true
	},
	start: {
		type: Date,
		default: Date.now
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
	collection: 'games'
});

mongoose.model('Game', sessionSchema);