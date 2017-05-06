const HueApi = require('node-hue-api').HueApi;
const config = require('../config');

const api = new HueApi(config.hue.bridge.ip, config.hue.bridge.username);
const targetGroups = config.hue.adjustGroups;

const Scene = {
	DAYLIGHT: 'daylight',
	EVENING: 'evening',
}


// Go through target groups from config and change scene
// to sceneType (Scene.DAYLIGHT or Scene.EVENING) if
// at least one light from that group is currently on.
function changeSceneIfAnyLightsAreOn(sceneType) {
	api.groups()
		.then((groups) => {
			targetGroups.forEach((target) => {
				const group = groups[target.id];

				if (group.state.any_on) {
					api.activateScene(target.scenes[sceneType]);
					console.log(`Changed scene in "${group.name}" (${new Date()})`);
				} else {
					console.log(`Lights were not on in "${group.name}" (${new Date()})`);
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

module.exports = {
	daylight: () => {
		changeSceneIfAnyLightsAreOn(Scene.DAYLIGHT);
	},
	evening: () => {
		changeSceneIfAnyLightsAreOn(Scene.EVENING);
	},
}
