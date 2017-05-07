const assert = require('assert');
const sandbox = require('sinon').sandbox.create();
const group = require('./group');

// Stubs
const api = require('./hue-api.js');
const config = require('../config');

// Test data
function makeGroupsState(isAnyOn) {
	return {
		"1": {
			"state": {
				"any_on": isAnyOn,
			}
		}
	};
}
const adjustGroups = [
	{
		id: 1,
		scenes: {
			daylight: 'daySceneId',
			evening: 'nightSceneId',
		},
	},
];


describe('Group', () => {

	describe('Toggle', () => {
		beforeEach(() => {
			sandbox.stub(api);
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('should turn on when any light(s) in the group are off', () => {
			api.groups.resolves(makeGroupsState(false));
			return group.toggle(1)
				.then(() => {
					const state = getLightStateFromArgs(api.setGroupLightState.args);
					assert(api.setGroupLightState.calledOnce);
					assert(state);
				});
		});

		it('should turn off when any light(s) in the group are on', () => {
			api.groups.resolves(makeGroupsState(true));
			return group.toggle(1)
				.then(() => {
					const state = getLightStateFromArgs(api.setGroupLightState.args);
					assert(api.setGroupLightState.calledOnce);
					assert.equal(state, false);
				});
		});
	});

	describe('Smart Toggle', () => {
		beforeEach(() => {
			sandbox.stub(api);
		});
		afterEach(() => {
			sandbox.restore();
		});

		it('should turn off when any light(s) in the group are on', () => {
			api.groups.resolves(makeGroupsState(true));
			return group.smartToggle(1)
				.then(() => {
					const state = getLightStateFromArgs(api.setGroupLightState.args);
					assert(api.setGroupLightState.calledOnce);
					assert.equal(state, false);
				});
		});

		describe('Sunlight detection', () => {
			beforeEach(() => {
				sandbox.restore();
				sandbox.stub(api);
				api.groups.resolves(makeGroupsState(false));
				sandbox.stub(config).hue.adjustGroups = adjustGroups;
			});

			it('10 AM', () => {
				sandbox.useFakeTimers(new Date().setTime(10));
				return group.smartToggle(1)
					.then(() => {
						assert(api.activateScene.calledOnce);
						assert.equal(api.activateScene.args[0], 'daySceneId');
					});
			});

			it('22 PM', () => {
				sandbox.useFakeTimers(new Date().setTime(22));
				return group.smartToggle(1)
					.then(() => {
						assert(api.activateScene.calledOnce);
						assert.equal(api.activateScene.args[0], 'nightSceneId');
					});
			});

			it('3 AM', () => {
				sandbox.useFakeTimers(new Date().setTime(3));
				return group.smartToggle(1)
					.then(() => {
						assert(api.activateScene.calledOnce);
						assert.equal(api.activateScene.args[0], 'nightSceneId');
					});
			});

		})
	});
});


// Utility
function getLightStateFromArgs(args) {
	return args[0][1]["_values"]["on"];
}
