const app = require('express')();
const hueScheduler = require('./hue/controllers/scheduler.js');

const server = app.listen(8000, () => {
	const port = server.address().port;
	console.log('Listening at port %s', port);
})

// Set up cron-like Hue schedule on first launch
hueScheduler();


// ====================================
// Routes
// ====================================
app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.get('/hue/*', (req, res) => {
	res.send('Hello Hue!');
});

