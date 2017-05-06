const schedule = require('node-schedule');
const sunTimesScheduler = require('../models/scheduler');

module.exports = () => {
	// Always update sunrise/sunset times on first launch
	sunTimesScheduler();


	// Update sunrise/sunset times every day at midnight
	schedule.scheduleJob('0 0 * * *', () => {
		sunTimesScheduler();
		console.log('Updated sunrise/sunset times');
	});
}
