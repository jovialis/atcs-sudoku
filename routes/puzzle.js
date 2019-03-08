const controller = require('../controllers/puzzle');

module.exports.registerRoutes = (router) => {

	router.post('/puzzle/next', controller.routeNextPuzzleForUser);
	router.post('/puzzle/solve', controller.routeValidateSolution);

};