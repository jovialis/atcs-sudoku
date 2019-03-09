const controller = require('../controllers/puzzle');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.post('/puzzle/next', auth.requireUser, controller.routeNextPuzzleForUser);
	router.post('/puzzle/leaderboard/:id', auth.requireUser, controller.routeNextPuzzleForUser);
	router.post('/puzzle/validate', auth.requireUser, controller.routeValidateSolution);

};