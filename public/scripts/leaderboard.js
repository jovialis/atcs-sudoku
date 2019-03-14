function setLeaderboard(leaderboard) {

    clearLeaderboard();
    const mount = document.getElementById("mount-leaderboard");

    if (!leaderboard || leaderboard.length === 0) {
        document.getElementById('leaderboard-status').innerHTML = "Nobody has solved this puzzle yet.";
        return;
    }

    document.getElementById('leaderboard-status').innerHTML = "";

    for (const child of leaderboard) {
        const name = child.name;
        const attempts = child.attempts;
        const time = child.time;

        const row = document.createElement('tr');
        row.setAttribute('id', 'row-entry');

        const nameData = document.createAttribute('td');
        nameData.setAttribute('class', 'col-name');
        nameData.innerHTML = name;

        const timeData = document.createAttribute('td');
        timeData.setAttribute('class', 'col-time');
        timeData.innerHTML = `${ time / 1000 }s`;

        const attemptsData = document.createAttribute('td');
        attemptsData.setAttribute('class', 'col-attempts');
        attemptsData.innerHTML = `${ attempts }`;

        row.appendChild(nameData);
        row.appendChild(timeData);
        row.appendChild(attemptsData);
        
        mount.appendChild(row);
    }

}

function clearLeaderboard() {

    const mount = document.getElementById("mount-leaderboard");
    for (const child of mount.childNodes) {
        if (child.classList.contains('row-entry')) {
            child.remove();
        }
    }

}