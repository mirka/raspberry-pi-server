const api = require('./hue-api.js');
const lightState = require('node-hue-api').lightState;
const config = require('../config');

const targetGroups = config.hue.adjustGroups;
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
	toggleUsingFunction(groupId, () => {
		api.setGroupLightState(groupId, states.on);
	});
}

// Toggle group on/off, switching between scenes depending on time of day
function smartToggle(groupId) {
	toggleUsingFunction(groupId, () => {
		let target = targetGroups.find(findSceneForGroup);

		if (true /* TODO: is daytime */) {
			api.activateScene(target.scenes[Scene.DAYLIGHT]);
		} else {
			api.activateScene(target.scenes[Scene.EVENING]);
		}
	});

	function findSceneForGroup(item) {
		return item.id == groupId;
	}
}

// onFunction decides what to do when group lights are currently off
function toggleUsingFunction(groupId, onFunction) {
	api.groups()
		.then((groups) => {
			const group = groups[groupId];

			if (group.state.any_on) {
				api.setGroupLightState(groupId, states.off);
			} else {
				onFunction();
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

module.exports = {
	toggle: toggle,
	smartToggle: smartToggle,
}
