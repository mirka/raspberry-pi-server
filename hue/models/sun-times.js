const https = require('https');
const cacheProvider = require('./cache');
const config = require('../config');

const coords = config.sunTimesCoords;
const sunsetSunriseApiOptions = {
	method: 'GET',
	hostname: 'api.sunrise-sunset.org',
	path: `/json?lat=${coords.lat}&lng=${coords.lng}&formatted=0`,
}

const sunTimesKey = 'sunTimes';
const ttl = 86400; // 24 hrs


function getSunsetSunriseTimes(options) {
	const cache = cacheProvider.getInstance();

	return new Promise((resolve, reject) => {
		cache.get(sunTimesKey, (err, value) => {
			if (!err && value) {
				resolve(value);
			} else {
				callApi();
			}
		});

		function callApi() {
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
					cache.set(sunTimesKey, times, ttl);
					resolve(times);
				});
			});

			req.end();
		}
	});
}

module.exports = function() {
	return getSunsetSunriseTimes(sunsetSunriseApiOptions)
		.catch((err) => {
			console.log(err);
		});
};
