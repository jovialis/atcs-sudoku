let addedRows = [];

function setLeaderboard(leaderboard) {

    clearLeaderboard();
    const mount = document.getElementById("mount-leaderboard");

    if (!leaderboard || leaderboard.length === 0) {
        document.getElementById('leaderboard-status').innerHTML = "Nobody has solved this puzzle yet.";
        return;
    }

    document.getElementById('leaderboard-status').innerHTML = "";

    for (const child of leaderboard) {
        const name = child.user;
        const attempts = child.attempts;
        const time = child.time;

        const row = document.createElement('tr');
        row.setAttribute('id', 'row-entry');

        const nameData = document.createElement('td');
        nameData.setAttribute('class', 'col-name');
        nameData.innerHTML = name;

        const timeData = document.createElement('td');
        timeData.setAttribute('class', 'col-time');
        timeData.innerHTML = `${ time / 1000 }s`;

        const attemptsData = document.createElement('td');
        attemptsData.setAttribute('class', 'col-attempts');
        attemptsData.innerHTML = `${ attempts }`;

        row.appendChild(nameData);
        row.appendChild(timeData);
        row.appendChild(attemptsData);

        mount.appendChild(row);
        addedRows.push(row);
    }

}

function clearLeaderboard() {

    for (const row of addedRows) {
    	row.parentElement.removeChild(row);
    }

    addedRows = [];

}