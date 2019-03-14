function letMeWin() {
	setStatus('Checking your solution...', 'status-checking', 2000);

	const values = extractPageValues();

	axios.post('/puzzle/mulligan', {
		puzzle: values
	}).then(result => {
		if (result.data.valid) {
			const solution = result.data.solution;

			// Show solution
			boardOverlayStructure(curPuzzleStructure, solution);

			setLeaderboard(result.data.leaderboard);

			/// Valid
			setStatus('Correct!!', 'status-correct', 200000);
			showButtons('next');
		} else {
			// Invalid
			setStatus('That is not quite right! Keep trying.', 'status-incorrect', 2000);
		}
	}).catch(err => {
		console.log(err);
	});
}