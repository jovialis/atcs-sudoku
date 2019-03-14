const boardMount = document.getElementById("mount-puzzle");

(function generateBoard() {
	// Setup table
	const mainTable = document.createElement("table");
	mainTable.setAttribute("id", "puzzle-board");
	mainTable.setAttribute("cellspacing", "0");
	mainTable.setAttribute("cellpadding", "0");
	boardMount.appendChild(mainTable);

	// Generate the three rows of big boxes
	for (let a = 0; a < 3; a++) {
		const groupRow = document.createElement("tr");
		mainTable.appendChild(groupRow);

		// Generate the three big boxes within each row
		for (let b = 0; b < 3; b++) {
			const groupData = document.createElement("td");

			groupRow.appendChild(groupData);

			const groupTable = document.createElement("table");
			// Assign either an A group or a B group, alternating
			groupTable.setAttribute("class", `board-group board-group-${("ab".split('')[((a * 3) + b) % 2])}`);
			groupTable.setAttribute("id", `board-group-${(a * 3) + b}`);
			groupTable.setAttribute("cellspacing", "1");
			groupTable.setAttribute("cellpadding", "0");
			groupData.appendChild(groupTable);

			// Rows within the big box
			for (let x = 0; x < 3; x++) {
				const boxRow = document.createElement("tr");
				groupTable.appendChild(boxRow);

				// Data within the bix boxs' row
				for (let y = 0; y < 3; y++) {
					const boxData = document.createElement("td");
					boxData.setAttribute("class", "board-cell");
					boxData.setAttribute("id", `board-cell-${(a * 3) + x}-${(b * 3) + y}`);
					boxRow.appendChild(boxData);

					const boxDiv = document.createElement("div");
					boxDiv.setAttribute("class", "cell-liner");
					boxData.appendChild(boxDiv);
				}
			}
		}
	}
})();

function boardOverlayStructure(original, overlay) {
	for (let row = 0; row < original.length; row++) {
		for (let col = 0; col < original[row].length; col++) {
			const val = original[row][col];

			// If the puzzle has a zero here, that's a user input field. Which means we should overlay a value.
			const shouldOverlay = val === 0;
			if (!shouldOverlay) {
				continue;
			}

			const boxElement = document.getElementById(`board-cell-${row}-${col}`);
			const liner = boxElement.getElementsByClassName("cell-liner")[0];

			// Remove all existing children
			for (const childNode of liner.childNodes) {
				childNode.remove();
			}

			let valueWrapper = document.createElement("span");
			valueWrapper.innerHTML = `${overlay[row][col]}`;
			valueWrapper.setAttribute('class', 'value-container value-overlay');

			liner.appendChild(valueWrapper);
		}
	}
}

function boardLoadStructure(structure) {
	for (let row = 0; row < structure.length; row++) {
		for (let col = 0; col < structure[row].length; col++) {
			const val = structure[row][col];

			const boxElement = document.getElementById(`board-cell-${row}-${col}`);
			const liner = boxElement.getElementsByClassName("cell-liner")[0];

			// Remove all existing children
			for (const childNode of liner.childNodes) {
				childNode.remove();
			}

			let valueWrapper;

			if (val === 0) {
				valueWrapper = document.createElement("input");
				valueWrapper.setAttribute('onkeypress', 'preventLetterKeystroke(event)');
				valueWrapper.setAttribute('onchange', 'preventLetterEntry(event)');
				valueWrapper.setAttribute('maxlength', '1'); // fixes the length of the input to 1 character
			} else {
				valueWrapper = document.createElement("span");
				valueWrapper.innerHTML = `${val}`;
			}

			valueWrapper.setAttribute('class', 'value-container');

			liner.appendChild(valueWrapper);
		}
	}
}

function preventLetterKeystroke(event) {
	/*
	CREDIT: https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
	*/

	var theEvent = event || window.event;

	// Handle paste
	if (theEvent.type === 'paste') {
		key = theEvent.clipboardData.getData('text/plain');
	} else {
		// Handle key press
		var key = theEvent.keyCode || theEvent.which;
		key = String.fromCharCode(key);
	}
	var regex = /[1-9]|\./;
	if (!regex.test(key)) {
		theEvent.returnValue = false;
		if (theEvent.preventDefault) theEvent.preventDefault();
	}
}

function preventLetterEntry(event) {
	const val = event.target.value;

	if (!Number(val)) {
		event.target.value = null;
	}
}

function extractPageValues() {
	let puzzle = [];
	for (let rowI = 0; rowI < 9; rowI++) {
		let row = [];
		for (let colI = 0; colI < 9; colI++) {
			// Grab the value for this index
			const element = document.getElementById(`board-cell-${rowI}-${colI}`).getElementsByClassName('value-container')[0];

			let val;

			// If it's an input, we get the value. Otherwise, we get the inner HTML
			if (element.tagName === "INPUT") {
				val = element.value;
			} else if (element.tagName === "SPAN") {
				val = element.innerHTML;
			}

			row.push(Number(val) ? Number(val) : 0);
		}
		puzzle.push(row);
	}
	return puzzle;
}

let statusLock;

function setStatus(status, classNames, timeout) {
	const statusElement = document.getElementById("status");

	const beforeClasses = statusElement.getAttribute("class");

	const newLock = Math.random();
	statusLock = newLock;

	statusElement.innerHTML = status;
	statusElement.setAttribute("class", classNames);

	setTimeout(function() {
		// If no other handler has updated the status
		if (statusLock === newLock) {
			statusElement.innerHTML = "";
			statusElement.setAttribute("class", beforeClasses);
		}
	}, timeout);
}

function showIngameHUD(ingame) {
	if (ingame) {
		document.getElementById("action-next").style.visibility = "hidden";

		document.getElementById("action-reset").style.visibility = "visible";
		document.getElementById("action-check").style.visibility = "visible";
		document.getElementById("action-forfeit").style.visibility = "visible";
	} else {
		document.getElementById("action-next").style.visibility = "visible";

		document.getElementById("action-reset").style.visibility = "hidden";
		document.getElementById("action-check").style.visibility = "hidden";
		document.getElementById("action-forfeit").style.visibility = "hidden";
	}
}

function showPuzzleID(uuid) {
	document.getElementById("mount-puzzleid").innerHTML = uuid;
}