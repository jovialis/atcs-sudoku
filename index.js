const express = require('express');
const bodyParser = require('body-parser');
const expressSsl = require('express-sslify');

const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const path = require('path');

const production = process.env.PRODUCTION && process.env.PRODUCTION === 'true';

// Register mongoose models
registerModels();

// Setup server
const router = express();
router.disable('x-powered-by');

// Redirect to HTTPS
if (production) {
	router.use(expressSsl.HTTPS({trustProtoHeader: true}));
}

// POST middleware
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// Session storage
let sessionOptions = {
	secret: process.env.SESSION_SECRET,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	resave: false,
	saveUninitialized: true
};

if (production) {
	router.set('trust proxy', 1);

	// HTTPS enabled
	sessionOptions.cookie.secure = true // serve secure cookies
}

router.use(session(sessionOptions));

// Serve static files
router.use('/static', express.static(path.join(__dirname, 'public')));

// Register all util routes
registerRoutes(router);

// Grab port and start listening
const port = process.env.PORT || 3000;
router.listen(port, () => {
	console.log("Express is now listening on port: " + port);
});

function registerRoutes(router) {

	require('./routes/pages').registerRoutes(router);
	require('./routes/user').registerRoutes(router);
	require('./routes/puzzle').registerRoutes(router);

}

function registerModels() {

	mongoose.connect(process.env.MONGODB_URI);

	require('./models/game');
	require('./models/puzzle');
	require('./models/user');

}