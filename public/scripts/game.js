let curPuzzleStructure;
let curPuzzleUid;
let curPuzzleDifficulty;
let curPuzzleAttempts = 0;

function nextGame() {
	axios.post('/puzzle/next').then(res => {
		const puzzle = res.data.puzzle;

		curPuzzleUid = puzzle.uid;
		curPuzzleDifficulty = puzzle.difficulty;
		curPuzzleStructure = puzzle.structure;

		boardLoadStructure(curPuzzleStructure);
	}).catch(err => {
		console.log(err);
	});
}

function resetBoard() {
	boardLoadStructure(curPuzzleStructure);
}

function checkAnswer() {
	const values = extractPageValues();

	axios.post('/puzzle/validate', {
		puzzle: values
	}).then(result => {
		curPuzzleAttempts = result.data.attempts;

		if (result.data.valid) {
			/// Valid
			console.log('Correct!');
		} else {
// Invalid
			console.log('Oof! Incorrect!');
		}
	}).catch(err => {
		console.log(err);
	});
}

function giveUp() {
	axios.post('/puzzle/forfeit').then(result => {
		// forfeited: true,
		// 	attempts: doc.attempts,
		// 	solution: puzzle,
		// 	time: ( doc.start - doc.finish )

		console.log(result.data);
		boardOverlayStructure(curPuzzleStructure, result.data.solution);
	}).catch(err => {
		console.log(err);
	});
}

nextGame();