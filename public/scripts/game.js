function getNextGame() {
	axios.post('/puzzle/next').then(res => {
		console.log(res.data);
	}).catch(err =>{
		console.log(err);
	});
}

getNextGame();