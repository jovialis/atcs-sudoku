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

function showButtons(status) {
    if (status === 'ingame') {
		document.getElementById("ingame-hud-button-wrapper").style.display = "block";
		document.getElementById("next-hud-button-wrapper").style.display = "none";
	} else if (status === 'next') {
        document.getElementById("ingame-hud-button-wrapper").style.display = "none";
		document.getElementById("next-hud-button-wrapper").style.display = "block";
	} else if (status === 'none') {
        document.getElementById("ingame-hud-button-wrapper").style.display = "none";
		document.getElementById("next-hud-button-wrapper").style.display = "none";
    }
}