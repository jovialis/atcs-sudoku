
function setup() {
	boardNum = 0; // set intial puzzle number
	newPuzzle(); // render the puzzle

	/* FOR TESTING PURPOSES */
	var el = document.getElementById("00"); // get top right box
	var child = el.children[0]; // get child of the div, which will either be SPAN or INPUT
	var value = "0";
	if(child.tagName === 'INPUT') {
		value = child.value;
		if (("" + value).length == 0) { // empty values on the board are treated
										// as empty strings. check for that case
			value = 0;
		} else { // if there isn't an empty string, there is input from the user.
				 // parse this input value as an int
			value = parseInt(value);
		}
	} else if(child.tagName == 'SPAN') {
		value = parseInt(child.textContent);
	}
	console.log(value);
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
	for(var i = 0; i < 9; i++) { // go through each row
		for(var j = 0; j < 9; j++) { // go through each column
			var id = "" + i + j; // cast to string
			var el = document.getElementById(id); // get div element
			var val = board[i][j]; // find value at row, column on the board
			var child;
			var elClass;

			if(val === 0) { // values on the board with 0 will be inputs for the user
				child = document.createElement("input");
				child.setAttribute('maxlength', 1); // fixes the length of the input to 1 character
				elClass = "editValue";
			} else { // other values are fixed using span tag. these are not editable
				child = document.createElement("span");
				child.textContent = val;
				elClass = "staticValue";
			}

			el.innerHTML = ""; // reset any previous html in this div
			el.setAttribute("class", elClass); // set the class for CSS purposes
			el.appendChild(child); // add new child into the div
		}
	}
}

function printPageValues() {
    
    
    
}

function newPuzzle() {
	// function to generate a new puzzle
	renderBoard(boards[boardNum%boards.length]);
	boardNum++;
}
