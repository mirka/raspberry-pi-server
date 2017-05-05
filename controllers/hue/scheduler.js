const schedule = require('node-schedule');
const sunTimes = require('./get-sun-times.js');
const adjustToDaylight = function() {} // TODO
const adjustToEvening = require('./adjust-to-evening.js');

module.exports = () => {

	sunTimes() // Fetch sunrise/sunset times
		.then((times) => {
			schedule.scheduleJob(new Date(times.sunrise), () => {
				adjustToDaylight();
				console.log('Adjusted to daylight');
			});

			schedule.scheduleJob(new Date(times.sunset), () => {
				adjustToEvening();
				console.log('Adjusted to evening');
			});
		})
		.catch((err) => {
			console.log(err);
		});

};
