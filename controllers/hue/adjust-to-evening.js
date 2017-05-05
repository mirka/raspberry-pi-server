const http = require('http');
const https = require('https');
const config = require('./config.js');

let ip = config.hue.bridge.ip;
const pathRoot = '/api/' + config.hue.bridge.username;
const sceneEveningId = config.hue.sceneIds.evening;
const mainLightName = config.hue.mainLightName;


function main() {
	getHueIP()
		.then((fetchedIp) => {
			ip = fetchedIp;
			return getLightState(mainLightName);
		})
		.then ((mainLightIsOn) => {
			if (mainLightIsOn) {
				setScene(sceneEveningId);
			}
		})
		.catch( err => {
			console.log(err);
		});
}

function getHueIP() {
	return new Promise((resolve, reject) => {
		if (ip) {
			resolve(ip);
		}

		const options = {
			method: 'GET',
			hostname: 'www.meethue.com',
			path: '/api/nupnp'
		};

		const req = https.request(options, (res) => {
			const chunks = [];

			res.on('data', (chunk) => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const body = Buffer.concat(chunks).toString();
				const ip = JSON.parse(body)[0].internalipaddress;
				resolve(ip);
			});
		});

		req.end();
	});
}

/**
 * Returns options object for http(s) requests.
 * @param {string} method - GET, POST, etc.
 * @param {string} path - Path after /api/<username>. Start with '/'.
 */
function buildReqOptions(method, path) {
	return {
		method: method,
		hostname: ip,
		path: pathRoot + path,
		headers: {
			'content-type': 'application/json',
		}
	}
}

/**
 * Returns a promise for the result of an http request.
 * Can manipulate the result body with optional resolveWith function.
 */
function buildReqPromise(options, resolveWith, writeBody) {
	if (typeof resolveWith != 'function') {
		resolveWith = (body) => { return body; };
	}

	return new Promise((resolve, reject) => {
		const req = http.request(options, (res) => {
			const chunks = [];

			res.on('data', (chunk) => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const body = Buffer.concat(chunks).toString();
				resolve( resolveWith(body) );
			});
		});

		if (writeBody) {
			req.write(JSON.stringify(writeBody));
		}

		req.on('error', (err) => {
			resolve(err);
		})

		req.end();
	});
}

function getLightState(lightName) {
	const options = buildReqOptions('GET', '/lights');
	return buildReqPromise(options, (body) => {
		const lights = JSON.parse(body);

		for (lightId in lights) {
			if (lights[lightId].name === lightName) {
				return (lights[lightId].state.on);
			}
		}
		throw new Error(`Light with name "${lightName}" was not found.`);
	});
}


function setScene(sceneId) {
	const options = buildReqOptions('PUT', '/groups/0/action');
	const writeBody = {
		scene: sceneId,
		transitiontime: 100,
	};
	return buildReqPromise(options, undefined, writeBody);
}

module.exports = main;
