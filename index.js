const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSsl = require('express-sslify');
const session = require('express-session');
const path = require('path');

// Register mongoose models
registerModels();

// Setup server
const router = express();

// Redirect to HTTPS
if (process.env.PRODUCTION && process.env.PRODUCTION === 'true') {
	router.use(expressSsl.HTTPS({trustProtoHeader: true}));
}

// POST middleware
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// Session storage
router.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true}
}));

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
	require('./models/session');
	require('./models/user');

}