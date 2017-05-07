const api = require('./hue-api.js');
const lightState = require('node-hue-api').lightState;
const sunTimes = require('./sun-times');
const config = require('../config');

const Scene = {
	DAYLIGHT: 'daylight',
	EVENING: 'evening',
}
const states = {
	off: lightState.create().off(),
	on: lightState.create().on(),
}


// Toggle group on/off
function toggle(groupId) {
	return toggleUsingFunction(groupId, () => {
		return api.setGroupLightState(groupId, states.on);
	});
}

// Toggle group on/off, switching between scenes depending on time of day
function smartToggle(groupId) {
	return toggleUsingFunction(groupId, () => {
		const targetGroups = config.hue.adjustGroups;
		let target = targetGroups.find(findSceneForGroup);

		return isDaytime()
			.then((isDaytimeNow) => {
				if (isDaytimeNow) {
					return api.activateScene(target.scenes[Scene.DAYLIGHT]);
				} else {
					return api.activateScene(target.scenes[Scene.EVENING]);
				}
			})
	});

	function findSceneForGroup(item) {
		return item.id == groupId;
	}
}


// ====================================
// Utility
// ====================================

// onFunction decides what to do when group lights are currently off
function toggleUsingFunction(groupId, onFunction) {
	return api.groups()
		.then((groups) => {
			const group = groups[groupId];

			if (group.state.any_on) {
				return api.setGroupLightState(groupId, states.off);
			} else {
				return onFunction();
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function minutesSinceMidnight(time) {
	return (time.getHours() * 60) + time.getMinutes();
}

// Returns whether current time is within sunrise and sunset
function isDaytime() {
	return sunTimes()
		.then((times) => {
			const now = minutesSinceMidnight(new Date());
			const sunrise = minutesSinceMidnight(times.sunrise);
			const sunset = minutesSinceMidnight(times.sunset);

			if (now > sunrise && now < sunset) {
				return true;
			} else {
				return false;
			}
		});
}


module.exports = {
	toggle: toggle,
	smartToggle: smartToggle,
}
