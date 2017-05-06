const https = require('https');
const config = require('../config.js');

const coords = config.sunTimesCoords;
const sunsetSunriseApiOptions = {
	method: 'GET',
	hostname: 'api.sunrise-sunset.org',
	path: `/json?lat=${coords.lat}&lng=${coords.lng}&date=tomorrow&formatted=0`,
}


function getSunsetSunriseTimes(options) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			const chunks = [];

			res.on('data', (chunk) => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const body = Buffer.concat(chunks).toString();
				const result = JSON.parse(body).results;
				const times = {
					sunrise: result.sunrise,
					sunset: result.sunset,
				}
				resolve(times);
			});
		});

		req.end();
	});
}

module.exports = function() {
	return getSunsetSunriseTimes(sunsetSunriseApiOptions)
	.catch((err) => {
		console.log(err);
	});
};
