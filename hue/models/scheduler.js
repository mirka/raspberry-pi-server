const schedule = require('node-schedule');
const sunTimes = require('./sun-times');
const adjustToSunlight = require('./adjust-to-sunlight');

module.exports = () => {

	sunTimes() // Fetch sunrise/sunset times
		.then((times) => {
			const sunrise = new Date(times.sunrise);
			const sunset = new Date(times.sunset);

			schedule.scheduleJob(sunrise, () => {
				adjustToSunlight.daylight();
			});

			schedule.scheduleJob(sunset, () => {
				adjustToSunlight.evening();
			});

			console.log(`Next sunrise scheduled for ${sunrise.toLocaleString()}`);
			console.log(`Next sunset scheduled for ${sunset.toLocaleString()}`);
		})
		.catch((err) => {
			console.log(err);
		});

};
