function validateSession(successfulRedirect, invalidRedirect) {
	const token = sessionStorage.getItem('_t');

	// Check whether the user has an active session. If so, we redirect to the successful route. Otherwise, the
	// invalid one.
	axios.post('/user/validate', {
		token: token
	}).then(response => {
		if (response.data.valid && successfulRedirect) {
			window.location.href = successfulRedirect;
		}

		if (!response.data.valid && invalidRedirect) {
			window.location.href = invalidRedirect;
		}
	}).catch(error => {
		console.log(error);
	});
}
