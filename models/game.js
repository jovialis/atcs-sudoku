const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
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
	collection: 'sessions'
});

mongoose.model('Game', sessionSchema);