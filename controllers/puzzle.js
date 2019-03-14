const mongoose = require('mongoose');
const chanceToGenerateNewPuzzle = 0.3;

module.exports.routeCurrentPuzzleForUser = (req, res) => {
	const user = req.session.user;
	const game = req.session.game;

	getCurrentPuzzleForUser(user, game).then(puzzle => {
		// Set session game
		req.session.game = puzzle.game;
		delete puzzle.game;

		res.json({
			puzzle: puzzle
		});
	}).catch(error => {
		console.log(error);
		res.status(error.code ? error.code : 500).send(error.message ? error.message : 'An internal error occurred');
	});
};

function getCurrentPuzzleForUser(user, gameToken) {
	return new Promise((resolve, reject) => {
		// If no game, generate a new game
		if (!gameToken) {
			generateNewGameForUser(user).then(resolve).catch(reject);
			return;
		}

		const Game = mongoose.model('Game');
		Game.findOne({
			token: gameToken
		}).populate('puzzle').exec().then(async game => {
			if (!game) {
				generateNewGameForUser(user).then(resolve).catch(reject);
				return;
			}

			let leaderboard;
			try {
				leaderboard = await getPuzzleLeaderboard(game.puzzle.uid);
			} catch (error) {
				console.log(error);
			}

			resolve({
				game: game.token,
				uid: game.puzzle.uid,
				difficulty: Number(game.puzzle.difficulty),
				structure: game.puzzle.structure,
				start: gameToken.start,
				leaderboard: leaderboard
			});
		}).catch(reject);
	});
}

module.exports.routeNextPuzzleForUser = (req, res) => {
	const user = req.session.user;
	const difficulty = req.body.difficulty ? req.body.difficulty : 1;

	generateNewGameForUser(user, difficulty).then(puzzle => {
		// Set session game
		req.session.game = puzzle.game;
		delete puzzle.game;

		res.json({
			puzzle: puzzle
		});
	}).catch(error => {
		console.log(error);
		res.status(error.code ? error.code : 500).send(error.message ? error.message : 'An internal error occurred');
	});
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
					difficulty: `${difficultyLevel}`
				}).sort(`${((Math.random() * 2) - 1)}`).exec();

				// Search for puzzles where the end date is defined, as these puzzles have either been forfeited or
				// completed
				const completedPuzzles = await Game.find({
					user: user._id,
					finish: {
						$ne: null
					}
				});

				// console.log('Completed:');
				// console.log(completedPuzzles);

				for (const availablePuzzle of availablePuzzles) {
					// If the completed puzzles doesn't contain this puzzle
					if (completedPuzzles.filter(doc => (doc.puzzle === availablePuzzle._id)).length === 0) {
						// console.log(`${ availablePuzzle._id }`);
						// puzzleDoc = availablePuzzle;
						break;
					}
				}

				// console.log('Found: ' + puzzleDoc._id);

				// If we got here, none of the puzzles will work, as we've already completed them all. Thus, we have
				// to generate one.
				if (!puzzleDoc) {
					generate = true;
				}
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

		let leaderBoard;
		try {
			leaderBoard = await getPuzzleLeaderboard(puzzleDoc._id);
		} catch (error) {
			reject(error);
			return;
		}

		// Generate new game object
		Game.create({
			user: user._id,
			puzzle: puzzleDoc._id,
		}).then(game => {
			resolve({
				game: game.token,
				uid: puzzleDoc.uid,
				difficulty: Number(puzzleDoc.difficulty),
				structure: puzzleDoc.structure,
				start: game.start,
				leaderboard: leaderBoard
			});
		}).catch(reject);
	});
}

module.exports.routeLeaderboardForPuzzle = (req, res) => {
	const id = req.param('id');
	routeGetLeaderboardForPuzzle(id).then(leaderboard => {
		res.json({
			leaderboard: leaderboard
		});
	}).catch(error => {
		console.log(error);
		res.status(error.code ? error.code : 500).send(error.message ? error.message : 'An internal error occurred');
	});
};

// Fetch by UID, instead of by _id
function routeGetLeaderboardForPuzzle(uid) {
	return new Promise((resolve, reject) => {
		const Puzzle = mongoose.model('Puzzle');
		Puzzle.findOne({
			uid: uid
		}).then(doc => {
			if (!doc) {
				reject({
					message: 'Invalid puzzle ID!',
					code: 404
				});
				return;
			}

			const id = doc._id;
			getPuzzleLeaderboard(id).then(resolve).catch(reject);
		}).catch(reject);
	});
}

function getPuzzleLeaderboard(puzzleId) {
	return new Promise((resolve, reject) => {
		// Find all completed games
		const Game = mongoose.model('Game');
		Game.find({
			puzzle: puzzleId,
			completed: true
		}).populate('user').exec().then(games => {
			let gamesObjectMap = games.map(o => o.toObject());
			gamesObjectMap = gamesObjectMap.sort((a, b) => {
				const aDuration = a.finish - a.start;
				const bDuration = b.finish - b.start;

				// Negative = A first. If bDuration is longer, it'll be negative.
				return aDuration - bDuration;
			});

			const cleanedLeaderboard = gamesObjectMap.map(o => {
				return {
					user: o.user.name,
					attempts: o.attempts,
					time: o.finish - o.start
				};
			});

			resolve(cleanedLeaderboard);
		}).catch(reject);
	});
}

function generatePuzzle(difficultyLevel) {
	return new Promise((resolve, reject) => {
		const startTime = new Date();

		// Generate blank puzzle
		let newPuzzle = [];
		for (let i = 0; i < 9; i++) {
			let add = [];
			for (let x = 0; x < 9; x++) {
				add.push(0)
			}
			newPuzzle.push(add)
		}

		// Populate solutions array with all solutions
		generateSolutions(newPuzzle, [], 0, 0, true);

		// Clone the solution so we can test on it
		let testingSolution = [];
		for (let row = 0; row < newPuzzle.length; row++) {
			let newPuzzleCols = [];
			for (let col = 0; col < newPuzzle[row].length; col++) {
				newPuzzleCols.push(newPuzzle[row][col]);
			}
			testingSolution.push(newPuzzleCols);
		}

		// Normalize from [3] - [1] with three being easiest, one being hardest
		const difficulty = 4 - Math.min(3, Math.max(1, difficultyLevel));
		// Generate between eight and 24 numbers.

		// Try N times to remove values from the puzzle.
		const numberOfNumbersToRemove = 81 - 8 * difficulty;
		for (let i = 0; i < numberOfNumbersToRemove; i++) {
			const randomX = Math.floor(Math.random() * 9);
			const randomY = Math.floor(Math.random() * 9);

			const value = testingSolution[randomX][randomY];

			// Ignore if it's already been removed
			if (value === 0) {
				i--;
				continue;
			}

			testingSolution[randomX][randomY] = 0;

			let unwantedSolutions = [];
			generateSolutions(testingSolution, unwantedSolutions, 0, 0, false);

			// If removing this number leads to more than one solution or none at all, we put it back and continue on
			if (unwantedSolutions.length > 1 || unwantedSolutions.length === 0) {
				testingSolution[randomX][randomY] = value;
			}
		}

		const Puzzle = mongoose.model('Puzzle');
		const puzzleDoc = new Puzzle({
			difficulty: `${difficultyLevel}`,
			structure: testingSolution,
			solution: newPuzzle
		});

		puzzleDoc.save().then(() => {
			const endTime = new Date();
			console.log('Generated unique puzzle ' + puzzleDoc.uid + ' in ' + (endTime - startTime) + 'ms');

			resolve(puzzleDoc);
		}).catch(reject);
	});
}

module.exports.routeValidateSolution = (req, res) => {
	const token = req.session.game;
	const puzzle = req.body.puzzle;

	validateSolution(token, puzzle).then(valid => {
		res.json(valid);
	}).catch(error => {
		console.log(error);
		res.status(error.code ? error.code : 500).send(error.message ? error.message : 'An internal error occurred');
	});
};

function validateSolution(gameToken, userSolution) {
	return new Promise((resolve, reject) => {
		if (!validatePuzzleDimensions(userSolution)) {
			reject({
				code: 400,
				message: "Invalid puzzle dimensions provided"
			});
			return;
		}

		const Game = mongoose.model('Game');

		Game.findOne({
			token: gameToken
		}).populate('puzzle').populate('user').exec().then(doc => {
			if (!doc) {
				reject({
					code: 400,
					message: "Invalid token provided"
				});
				return;
			}

			if (doc.completed || doc.forfeited) {
				reject({
					message: "Puzzle already completed",
					code: 409
				});
				return;
			}

			const puzzle = doc.puzzle;
			const solution = puzzle.solution;

			// Compare all user answers to the generated solution.
			let correct = true;
			for (let x = 0; x < solution.length; x++) {
				for (let y = 0; y < solution[x].length; y++) {
					if (solution[x][y] !== userSolution[x][y]) {
						correct = false;
						break;
					}
				}

				// Break out of outer loop
				if (!correct) {
					break;
				}
			}

			if (correct) {
				doc.finish = new Date();
				doc.completed = true;
			}

			doc.attempts++;

			doc.save().then(() => {
				resolve({
					valid: correct,
					attempts: doc.attempts
				});
			}).catch(reject);
		}).catch(reject);
	});
}

module.exports.routeForfeitPuzzle = (req, res) => {
	const token = req.session.game;

	forfeitPuzzle(token).then(result => {
		req.session.game = null;
		res.json(result);
	}).catch(error => {
		console.log(error);
		res.status(error.code ? error.code : 500).send(error.message ? error.message : 'An internal error occurred');
	});
};

function forfeitPuzzle(gameToken) {
	return new Promise((resolve, reject) => {
		const Game = mongoose.model('Game');

		Game.findOne({
			token: gameToken
		}).populate('puzzle').populate('user').exec().then(async doc => {
			if (!doc) {
				reject({
					code: 400,
					message: "Invalid token provided"
				});
				return;
			}

			if (doc.completed || doc.forfeited) {
				reject({
					message: "Puzzle already completed",
					code: 409
				});
				return;
			}

			doc.finish = new Date();
			doc.forfeited = true;

			const puzzle = doc.puzzle.solution;

			// Optionally get leaderBoard for this puzzle
			let leaderBoard = undefined;
			try {
				leaderBoard = await getPuzzleLeaderboard(doc.puzzle._id);
			} catch (error) {
				console.log(error);
			}

			doc.save().then(saved => {
				resolve({
					forfeited: true,
					attempts: doc.attempts,
					solution: puzzle,
					time: (doc.finish - doc.start),
					leaderboard: leaderBoard
				});
			}).catch(reject)
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

function generateSolutions(puzzle, solutionsList, curRow, curCol, singleValue) {
	if (curRow === -1 || curCol === -1) {
		// Manual check because they might sometimes get passed as a result of getting all solutions
		return false;
	}

	// If the value here is pre populated
	if (puzzle[curRow][curCol] !== 0) {
		const incremented = getNextRowAndColumn(curRow, curCol);

		// If we're at the end, we duplicate the current puzzle and add it to the solutions list, then return false
		// to see if we can keep going to find another solution.
		if (incremented['row'] === -1 || incremented['col'] === -1) {
			// If we only want one solution, we return true here and puzzle will be changed.
			if (singleValue) {
				return true;
			}

			// Otherwise we:

			// Clone the current puzzle
			let newPuzzleRows = [];
			for (let row = 0; row < puzzle.length; row++) {
				let newPuzzleCols = [];
				for (let col = 0; col < puzzle[row].length; col++) {
					newPuzzleCols.push(puzzle[row][col]);
				}
				newPuzzleRows.push(newPuzzleCols);
			}

			// Append the cloned puzzle to the list of solutions
			solutionsList.push(newPuzzleRows);

			return false;
		}

		// Go to next position
		return generateSolutions(puzzle, solutionsList, incremented['row'], incremented['col'], singleValue);
	}

	// Otherwise, we go through all possible values
	const initialValue = puzzle[curRow][curCol];

	let valid = false;
	// Choose random order of 1-9
	for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9].sort((a, b) => Math.random() * 2 - 1)) {
		if (numberIsValidInPosition(puzzle, i, curRow, curCol)) {
			puzzle[curRow][curCol] = i;

			const incremented = getNextRowAndColumn(curRow, curCol);

			// If we've reached the end of the puzzle
			if (incremented['row'] === -1 || incremented['col'] === -1) {
				if (singleValue) {
					valid = true;
					break;
				} else {
					// Clone the current puzzle
					let newPuzzleRows = [];
					for (let row = 0; row < puzzle.length; row++) {
						let newPuzzleCols = [];
						for (let col = 0; col < puzzle[row].length; col++) {
							newPuzzleCols.push(puzzle[row][col]);
						}
						newPuzzleRows.push(newPuzzleCols);
					}

					// Append the cloned puzzle to the list of solutions
					solutionsList.push(newPuzzleRows);
				}
			}

			if (generateSolutions(puzzle, solutionsList, incremented['row'], incremented['col'], singleValue)) {
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