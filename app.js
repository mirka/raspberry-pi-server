const app = require('express')();
const schedule = require('node-schedule');
const sunTimesScheduler = require('./controllers/hue/scheduler.js');

const server = app.listen(8000, () => {
	const port = server.address().port;
	console.log('Listening at port %s', port);
})

// Always update sunrise/sunset times on first launch
sunTimesScheduler();


// ====================================
// Update sunrise/sunset times every day at midnight
// ====================================
schedule.scheduleJob('0 0 * * *', () => {
	sunTimesScheduler();
	console.log('Updated sunrise/sunset times');
});


// ====================================
// Routes
// ====================================
app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.get('/hue/*', (req, res) => {
	res.send('Hello Hue!');
});

