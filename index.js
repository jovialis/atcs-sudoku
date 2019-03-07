const express = require('express');
const bodyParser = require('body-parser');
const expressSsl = require('express-sslify');
const session = require('express-session');

const path = require('path');

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

// Register all util routes
registerRoutes(router);

// Serve static files
router.use('/static', express.static(path.join(__dirname, 'public')));

// Serve index file always
router.get('*', (req, res) => {
	res.sendfile(path.join(__dirname, 'public/index.html'));
});

// Grab port and start listening
const port = process.env.PORT || 3000;
router.listen(port, () => {
	console.log("Express is now listening on port: " + port);
});

function registerRoutes(router) {
//	TODO: Register routes
}