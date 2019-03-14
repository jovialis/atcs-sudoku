let curPuzzleStructure;

function getCurrentGame() {
    setLoading();

    axios.post('/puzzle/current').then(res => {        
        const puzzle = res.data.puzzle;

        setPuzzleID(puzzle.uid);
        setLeaderboard(puzzle.leaderboard);

        curPuzzleStructure = puzzle.structure;
        boardLoadStructure(puzzle.structure);

	    showButtons('ingame');
        
        setStatus('', '', 0);
    });
}

function nextGame() {
    setLoading();
    curPuzzleStructure = null;
    
    axios.post('/puzzle/next').then(res => {
        const puzzle = res.data.puzzle;
        
        setPuzzleID(puzzle.uid);
        setLeaderboard(puzzle.leaderboard);

        curPuzzleStructure = puzzle.structure;
        boardLoadStructure(puzzle.structure);

	    showButtons('ingame');

	    setStatus('Loaded!', 'status-loading', 5000);
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
        if (result.data.valid) {
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

function giveUp() {
    setStatus('You gave up. Fetching solution...', 'status-forfeit', 4000);

    axios.post('/puzzle/forfeit').then(result => {
        boardOverlayStructure(curPuzzleStructure, result.data.solution);
		setLeaderboard(result.data.leaderboard);

	    showButtons('next');

	    setStatus('Solution Found', 'status-solution', 5000);
    }).catch(err => {
        console.log(err);
    });
}

function setPuzzleID(id) {
    document.getElementById("puzzle-id").innerHTML = id ? `${ id }` : "";
}

function setLoading() {
	showButtons('none');
	setLeaderboard(null);

	setStatus('Loading...', 'status-loading', 5000);
}