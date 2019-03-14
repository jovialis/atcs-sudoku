const controller = require('../controllers/puzzle');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.post('/puzzle/next', auth.requireUser, controller.routeNextPuzzleForUser);
	router.post('/puzzle/current', auth.requireUser, controller.routeCurrentPuzzleForUser);

	router.post('/puzzle/validate', auth.requireUser, controller.routeValidateSolution);
	router.post('/puzzle/forfeit', auth.requireUser, controller.routeForfeitPuzzle);

	router.get('/puzzle/leaderboard/:id', controller.routeLeaderboardForPuzzle);

};