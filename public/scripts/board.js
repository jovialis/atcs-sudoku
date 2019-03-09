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
			groupTable.setAttribute("class", `board-group board-group-${ ("ab".split('')[ ( (a * 3) + b ) % 2 ]) }`);
			groupTable.setAttribute("id", `board-group-${ (a * 3) + b }`);
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
					boxData.setAttribute("id", `board-cell-${ (a * 3) + x }-${ (b * 3) + y }`);
					boxRow.appendChild(boxData);
                    
                    const boxDiv = document.createElement("div");
                    boxDiv.setAttribute("class", "cell-liner");
                    boxData.appendChild(boxDiv);
				}
			}
		}
	}
})();