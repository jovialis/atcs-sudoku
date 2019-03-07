const mongoose = require('mongoose');

mongoose.model('Game', new mongoose.Schema({
	timestamp: {
		type: Date,
		default: Date
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
		required: true
	},
	finish: {
		type: Date,
		default: Date
	}
}, {
	collection: 'games'
}));