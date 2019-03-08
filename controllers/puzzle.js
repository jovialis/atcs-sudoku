const mongoose = require('mongoose');
const chanceToGenerateNewPuzzle = 0.4;

module.exports.routeNextPuzzleForUser = (req, res) => {
	const user = req.user;
	const difficulty = req.body.difficulty;

	generateNewGameForUser(user, difficulty).then(game => {
		// TODO: Serve leaderboard for this puzzle
		res.json({
			puzzle: game.puzzle
		});
	}).catch(error => {
		console.log(error);
		res.status(500).send('An internal error occurred');
	})
};

function generateNewGameForUser(user, difficultyLevel) {
	return new Promise(async (resolve, reject) => {
		const Puzzle = mongoose.model('Puzzle');
		const Game = mongoose.model('Game');

		// Determine whether to generate a new puzzle or reuse an old one
		let generate = Math.random() < chanceToGenerateNewPuzzle;
		let puzzleDoc;

		// If we shouldn't generate, we find an old puzzle. If there arern't any available (i.e. the user has
		// already completed them all, we set generate to true and generate them a puzzle.
		if (!generate) {
			try {
				// Get all puzzles of this difficulty, then randomize their order
				const availablePuzzles = await Puzzle.find({
					difficulty: `${ difficultyLevel }`
				}).sort((a, b) => ((Math.random() * 2) - 1));

				const completedPuzzles = await Game.find({
					user: user._id,
					completed: true
				});

				for (const availablePuzzle of availablePuzzles) {
					// If the completed puzzles doesn't contain this puzzle
					if (completedPuzzles.filter(doc => (doc.puzzle === availablePuzzle._id)).length === 0) {
						puzzleDoc = availablePuzzle;
						break;
					}
				}

				// If we got here, none of the puzzles will work, as we've already completed them all. Thus, we have
				// to generate one.
				generate = true;
			} catch (error) {
				reject(error);
				return;
			}
		}

		if (generate && !puzzleDoc) {
			try {
				puzzleDoc = await generatePuzzle(difficultyLevel);
			} catch (error) {
				reject(error);
				return;
			}
		}

		// Generate new game object
		Game.create({
			user: user._id,
			puzzle: puzzleDoc._id,
		}).then(resolve).catch(reject);
	});
}

// This is a temporary puzzle generator. It won't necessarily generate unique solutions.
function generatePuzzle(difficultyLevel) {
	return new Promise((resolve, reject) => {
		// Normalize from [3] - [1] with three being easiest, one being hardest
		const difficulty = 4 - Math.min(3, Math.max(1, difficultyLevel));
		// Generate between eight and 24 numbers.
		const numberOfNumbersToGenerate = 8 * difficulty;

		// Generate blank puzzle
		let newPuzzle = [];
		for (let i = 0; i < 9; i++) {
			let add = [];
			for (let x = 0; x < 9; x++) {
				add.push(0)
			}
			newPuzzle.push(add)
		}

		// Generate random numbers
		for (let i = 0; i < numberOfNumbersToGenerate; i++) {
			// Generates list of number strings, sorts them randomly, returns them mapped to number.
			const randomListOfPossibleValues = "123456789".split('').sort((a, b) => ((Math.random() * 2) - 1)).map(i => Number(i));

			// Generate random coords
			const randomRow = Math.floor(Math.random() * 9);
			const randomCol = Math.floor(Math.random() * 9);

			// Find a random number that'll work at that position
			for (const possibleVal of randomListOfPossibleValues) {
				if (numberIsValidInPosition(newPuzzle, possibleVal, randomRow, randomCol)) {
					newPuzzle[randomRow][randomCol] = possibleVal;
					break;
				}
			}
		}

		const Puzzle = mongoose.model('Puzzle');
		const puzzleDoc = new Puzzle({
			difficulty: `${ difficultyLevel }`,
			structure: newPuzzle
		});

		puzzleDoc.save().then(() => {
			resolve(puzzleDoc);
		}).catch(reject);
	});
}

// TODO: Check the user's provided puzzle against the one in the database to prevent duping.
module.exports.routeValidateSolution = (req, res) => {
	const token = req.get('PuzzleToken');
	const puzzle = req.body.puzzle;

	validateSolution(token, puzzle).then(valid => {

	}).catch(error => {
		res.status(500).send(error);
	});
};

function validateSolution(puzzleToken, puzzle) {
	return new Promise((resolve, reject) => {
		if (!validatePuzzleDimensions(puzzle)) {
			reject("Invalid puzzle dimensions provided");
			return;
		}

		const Game = mongoose.model('Game');

		Game.findOne({
			token: puzzleToken
		}).populate('puzzle').populate('user').exec().then(doc => {
			if (!doc) {
				reject("Invalid puzzle token provided");
				return;
			}

			const puzzle = doc.puzzle;
			const structure = puzzle.structure;

			doc.attempts++;

			let completed = false;

			if (validatePuzzleValues(structure)) {
				doc.finish = new Date();
				doc.completed = true;

				completed = true;
			}

			doc.save().then(() => {
				resolve(completed);
			}).catch(reject);
		}).catch(reject);
	});
}

function validatePuzzleDimensions(puzzle) {
	if (puzzle.length !== 9) {
		return false;
	}

	for (const row of puzzle) {
		if (row.length !== 9) {
			return false;
		}
	}

	return true;
}

function validatePuzzleValues(puzzle) {
	for (let rowI = 0; rowI < 9; rowI++) {
		for (let colI = 0; colI < 9; colI++) {
			const number = puzzle[rowI][colI];
			if (number === 0 || !numberIsValidInPosition(puzzle, number, rowI, colI)) {
				return false;
			}
		}
	}
	return true;
}

function generateSolution(puzzle, curRow, curCol) {
	// If the value is pre populated
	if (puzzle[curRow][curCol] !== 0) {
		const incremented = getNextRowAndColumn(curRow, curCol);

		// If we're at the end, we return true because we've finished
		if (incremented['row'] === -1 || incremented['col'] === -1) {
			return true;
		}

		// Go to next position
		return generateSolution(puzzle, incremented['row'], incremented['col']);
	}

	// Otherwise, we go through all possible values
	const initialValue = puzzle[curRow][curCol];

	let valid = false;
	for (let i = 1; i <= 9; i++) {
		if (numberIsValidInPosition(puzzle, i, curRow, curCol)) {
			puzzle[curRow][curCol] = i;

			const incremented = getNextRowAndColumn(curRow, curCol);

			// If we've reached the end of the puzzle
			if (incremented['row'] === -1 || incremented['col'] === -1) {
				valid = true;
				break;
			}

			if (generateSolution(puzzle, incremented['row'], incremented['col'])) {
				valid = true;
				break;
			}
		}
	}

	if (!valid) {
		puzzle[curRow][curCol] = initialValue;
	}

	return valid;
}

function getNextRowAndColumn(row, column) {
	if (column >= 8) {
		column = 0;
		row++;
	} else {
		column++;
	}

	if (row >= 9) {
		row = -1;
		column = -1;
	}

	return {
		'row': row,
		'col': column
	};
}

function numberIsValidInPosition(puzzle, number, row, column) {
	let rowRemoval = [];

	// Check if values are repeated in row
	for (let rowCount = 0; rowCount < 9; rowCount++) {
		// Don't check against the same square
		if (rowCount === row) {
			continue;
		}

		const itemAt = puzzle[rowCount][column];

		// Not set
		if (itemAt === 0) {
			continue;
		}

		// Value hasn't been discovered yet
		if (!rowRemoval.includes(itemAt)) {
			rowRemoval.push(itemAt);
		} else {
			return false;
		}
	}

	let colRemoval = [];

	// Check if values are repeated in column
	for (let colCount = 0; colCount < 9; colCount++) {
		// Don't check against the same square
		if (colCount === column) {
			continue;
		}

		const itemAt = puzzle[row][colCount];

		// Not set
		if (itemAt === 0) {
			continue;
		}

		// Value hasn't been discovered yet
		if (!colRemoval.includes(itemAt)) {
			colRemoval.push(itemAt);
		} else {
			return false;
		}
	}

	let bbRemoval = [];

	const bigBoxRowCoord = Math.floor(row / 3);
	const bigBoxColCoord = Math.floor(column / 3);

	for (let bbRow = 0; bbRow < 3; bbRow++) {
		for (let bbCol = 0; bbCol < 3; bbCol++) {
			const xCoord = 3 * bigBoxRowCoord + bbRow;
			const yCoord = 3 * bigBoxColCoord + bbCol;

			if (xCoord === row && yCoord === column) {
				continue;
			}

			const itemAt = puzzle[xCoord][yCoord];

			if (itemAt === 0) {
				continue;
			}

			if (!bbRemoval.includes(itemAt)) {
				bbRemoval.push(itemAt);
			} else {
				return false;
			}
		}
	}

	return !(rowRemoval.includes(number) || colRemoval.includes(number) || bbRemoval.includes(number));
}