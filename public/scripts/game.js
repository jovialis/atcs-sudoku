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

		showPuzzleID(curPuzzleUid);
		showIngameHUD(true);
	}).catch(err => {
		console.log(err);
	});
}

function resetBoard() {
	boardLoadStructure(curPuzzleStructure);
}

function checkAnswer() {
	setStatus('Checking your solution...', 'status-checking', 2000);

	const values = extractPageValues();

	axios.post('/puzzle/validate', {
		puzzle: values
	}).then(result => {
		curPuzzleAttempts = result.data.attempts;

		if (result.data.valid) {
			/// Valid
			setStatus('Correct!!', 'status-correct', 100000);
			showIngameHUD(false);
		} else {
// Invalid
			setStatus('That not right :(', 'status-incorrect', 5000);
			showIngameHUD(true);
		}
	}).catch(err => {
		console.log(err);
	});
}

function giveUp() {
	setStatus('You gave up. Fetching solution...', 'status-forfeit', 4000);

	axios.post('/puzzle/forfeit').then(result => {
		console.log(result.data);
		boardOverlayStructure(curPuzzleStructure, result.data.solution);

		showIngameHUD(false);
	}).catch(err => {
		console.log(err);
	});
}

nextGame();