const app = require('express')();
const cacheProvider = require('./hue/models/cache');
const bodyParser = require('body-parser');
const hueScheduler = require('./hue/controllers/scheduler');

const server = app.listen(8000, () => {
	const port = server.address().port;
	console.log('Listening at port %s', port);
})


// Start cache instance
cacheProvider.init();

// Set up cron-like Hue schedule on first launch
hueScheduler();


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
