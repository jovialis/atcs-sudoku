const controller = require('../controllers/puzzle');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.post('/puzzle/next', auth.requireUser, controller.routeNextPuzzleForUser);
	// router.post('/puzzle/stats/:id', auth.requireUser, controller.routeStatsForPuzzle);
	router.post('/puzzle/validate', auth.requireUser, controller.routeValidateSolution);
	router.post('/puzzle/forfeit', auth.requireUser, controller.routeForfeitPuzzle);

};