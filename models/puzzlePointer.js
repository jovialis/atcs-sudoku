const mongoose = require('mongoose');
const uuid = require('uuid/v3');

mongoose.model('PuzzlePointer', new mongoose.Schema({
	token: {
		type: String,
		default: uuid
	},
	puzzle: {
		type: 'ObjectId',
		ref: 'Puzzle',
		required: true
	}
}, {
	collection: 'pointers'
}));