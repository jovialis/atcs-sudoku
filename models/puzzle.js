const mongoose = require('mongoose');
const uuid = require('uuid/v4');

mongoose.model('Puzzle', new mongoose.Schema({
	uid: {
		type: String,
		default: uuid
	},
	difficulty: {
		type: String,
		enum: [ '1', '2', '3' ],
		required: true
	},
	structure: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	}
}, {
	collection: 'puzzles'
}));