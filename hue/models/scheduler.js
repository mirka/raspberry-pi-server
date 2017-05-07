const schedule = require('node-schedule');
const sunTimes = require('./sun-times');
const adjustToSunlight = require('./adjust-to-sunlight');

const jobs = {
	sunrise: undefined,
	sunset: undefined,
};

function cancelJobsIfExists(jobs) {
	for (let key in jobs) {
		if (jobs[key]) {
			jobs[key].cancel();
		}
	}
}

// Make cron rule using hour and minute
function buildRuleFrom(time) {
	const rule = new schedule.RecurrenceRule();
	rule.hour = time.getHours();
	rule.minute = time.getMinutes();
	return rule;
}

module.exports = () => {

	return sunTimes() // Fetch sunrise/sunset times
		.then((times) => {
			const sunriseRule = buildRuleFrom(times.sunrise);
			const sunsetRule = buildRuleFrom(times.sunset);

			cancelJobsIfExists(jobs);

			jobs.sunrise = schedule.scheduleJob(sunriseRule, () => {
				adjustToSunlight.daylight();
			});

			jobs.sunset = schedule.scheduleJob(sunsetRule, () => {
				adjustToSunlight.evening();
			});

			console.log(`Next sunrise scheduled for ${times.sunrise.toLocaleTimeString()}`);
			console.log(`Next sunset scheduled for ${times.sunset.toLocaleTimeString()}`);
		})
		.catch((err) => {
			console.log(err);
		});

};
