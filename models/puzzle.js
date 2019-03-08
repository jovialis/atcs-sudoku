const mongoose = require('mongoose');

mongoose.model('Puzzle', new mongoose.Schema({
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