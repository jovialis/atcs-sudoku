function setup() {
	boardNum = 0; // set intial puzzle number
	newPuzzle(); // render the puzzle

	/* FOR TESTING PURPOSES */
	var el = document.getElementById("00"); // get top right box
	var child = el.children[0]; // get child of the div, which will either be SPAN or INPUT
	var value = "0";
	if (child.tagName === 'INPUT') {
		value = child.value;
		if (("" + value).length == 0) { // empty values on the board are treated
			// as empty strings. check for that case
			value = 0;
		} else { // if there isn't an empty string, there is input from the user.
			// parse this input value as an int
			value = parseInt(value);
		}
	} else if (child.tagName == 'SPAN') {
		value = parseInt(child.textContent);
	}
}

function newPuzzle() {
	// function to generate a new puzzle
	renderBoard(boards[boardNum % boards.length]);
	boardNum++;

	console.log('Loaded game board #' + boardNum + ':');
	printPageValues();
}

function checkPuzzle() {
	const readout = document.getElementById("readout");
	if (validatePageValues()) {
		// Valid
		readout.innerHTML = "Yuo winn";
	} else {
		// Invalid
		readout.innerHTML = "wrong lul";
	}
}

function solvePuzzle() {
	let curBoard = boards[boardNum % boards.length];

	// Clone board to solve
	let startBoard = [];
	for (const level of curBoard) {
		let newLevel = [];
		for (const element of level)  {
			newLevel.push(element);
		}
		startBoard.push(newLevel);
	}

	const solved = generateSolution(startBoard, 0, 0);

	if (solved) {
		renderBoard(startBoard);
	} else {
		console.log('Failed to find solution for puzzle.');

	}
}

var boardNum;// global variable
var puzzle1 = [
	[5, 3, 0, 0, 7, 0, 0, 0, 0],
	[6, 0, 0, 1, 9, 5, 0, 0, 0],
	[0, 9, 8, 0, 0, 0, 0, 6, 0],
	[8, 0, 0, 0, 6, 0, 0, 0, 3],
	[4, 0, 0, 8, 0, 3, 0, 0, 1],
	[7, 0, 0, 0, 2, 0, 0, 0, 6],
	[0, 6, 0, 0, 0, 0, 2, 8, 0],
	[0, 0, 0, 4, 1, 9, 0, 0, 5],
	[0, 0, 0, 0, 8, 0, 0, 7, 9]
];
var puzzle2 = [
	[1, 6, 0, 0, 0, 3, 0, 0, 0],
	[2, 0, 0, 7, 0, 6, 0, 1, 4],
	[0, 4, 5, 0, 8, 1, 0, 0, 7],
	[5, 0, 8, 4, 0, 0, 0, 0, 0],
	[0, 0, 4, 3, 0, 8, 9, 0, 0],
	[0, 0, 0, 0, 0, 7, 2, 0, 8],
	[8, 0, 0, 6, 3, 0, 1, 9, 0],
	[6, 3, 0, 1, 0, 5, 0, 0, 2],
	[0, 0, 0, 8, 0, 0, 0, 3, 6]
];
var puzzle3 = [
	[8, 1, 0, 0, 2, 9, 0, 0, 0],
	[4, 0, 6, 0, 7, 3, 0, 5, 1],
	[0, 7, 0, 0, 0, 0, 8, 0, 2],
	[0, 0, 4, 5, 0, 0, 0, 0, 6],
	[7, 6, 0, 0, 0, 0, 0, 1, 3],
	[1, 0, 0, 0, 0, 6, 2, 0, 0],
	[2, 0, 7, 0, 0, 0, 0, 8, 0],
	[6, 9, 0, 2, 8, 0, 3, 0, 5],
	[0, 0, 0, 9, 6, 0, 0, 2, 4]
];
var puzzle4 = [
	[0, 0, 3, 0, 0, 8, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0],
	[0, 8, 0, 3, 5, 0, 9, 0, 0],
	[8, 0, 5, 0, 0, 6, 0, 0, 0],
	[1, 0, 0, 7, 3, 2, 0, 0, 8],
	[0, 0, 0, 8, 0, 0, 3, 0, 1],
	[0, 0, 8, 0, 1, 4, 0, 7, 0],
	[0, 0, 0, 0, 0, 0, 0, 5, 0],
	[0, 0, 0, 9, 0, 0, 2, 0, 0]
];
var puzzle5 = [
	[0, 8, 3, 7, 0, 0, 0, 9, 0],
	[0, 0, 7, 0, 5, 0, 6, 4, 0],
	[0, 0, 0, 9, 0, 0, 0, 0, 3],
	[0, 0, 0, 1, 0, 0, 0, 0, 7],
	[0, 6, 9, 2, 0, 4, 3, 8, 0],
	[7, 0, 0, 0, 0, 9, 0, 0, 0],
	[9, 0, 0, 0, 0, 3, 0, 0, 0],
	[0, 5, 6, 0, 2, 0, 4, 0, 0],
	[0, 1, 0, 0, 0, 7, 5, 3, 0]
];
boards = [puzzle1, puzzle2, puzzle3, puzzle4, puzzle5];

function renderBoard(board) {
	// function to render a new board based on the board variables above
	for (let i = 0; i < 9; i++) { // go through each row
		for (var j = 0; j < 9; j++) { // go through each column
			const id = "" + i + j; // cast to string
			const el = document.getElementById(id); // get div element
			const val = board[i][j]; // find value at row, column on the board

			let child;
			let elClass;

			if (val === 0) { // values on the board with 0 will be inputs for the user
				child = document.createElement("input");
				child.setAttribute('maxlength', 1); // fixes the length of the input to 1 character
				elClass = "editValue";
			} else { // other values are fixed using span tag. these are not editable
				child = document.createElement("span");
				child.textContent = val;
				elClass = "staticValue";
			}

			child.setAttribute('class', 'value-container');

			el.innerHTML = ""; // reset any previous html in this div
			el.setAttribute("class", elClass); // set the class for CSS purposes
			el.appendChild(child); // add new child into the div
		}
	}
}

function extractPageValues() {
	let puzzle = [];
	for (let rowI = 0; rowI < 9; rowI++) {
		let row = [];
		for (let colI = 0; colI < 9; colI++) {
			const val = document.getElementById(`${rowI}${colI}`).getElementsByClassName('value-container')[0].innerHTML;
			row.push(Number(val) ? Number(val) : 0);
		}
		puzzle.push(row);
	}
	return puzzle;
}

function validatePageValues() {
	const puzzle = extractPageValues();
	console.log('Extracted puzzle from page:');
	console.log(puzzle);

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

function printPageValues() {
	console.log(extractPageValues());
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