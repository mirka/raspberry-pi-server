const app = require('express')();
const nunjucks = require('nunjucks');
const cacheProvider = require('./hue/models/cache');
const bodyParser = require('body-parser');
const hueScheduler = require('./hue/controllers/scheduler');

require('dotenv').config();

const server = app.listen(8000, () => {
	const port = server.address().port;
	console.log('Listening at port %s', port);
});


// Start cache instance
cacheProvider.init();

// Set up cron-like Hue schedule on first launch
hueScheduler();

// Set up Nunjucks for Groceries
nunjucks.configure('/', {
	autoescape: true,
	express: app
});


// ====================================
// Middleware
// ====================================
app.use(bodyParser.json());


// ====================================
// Routes
// ====================================
app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.use('/hue', require('./hue/controllers'));

// Redirect to avoid relative path errors in index.html
app.all(/^\/groceries$/, (req, res) => {
	res.redirect('/groceries/');
});
app.use('/groceries/', require('./groceries'));

import('./sonos/controllers/index.mjs').then(sonosRoutes => {
	app.use('/sonos', sonosRoutes.default);
});
