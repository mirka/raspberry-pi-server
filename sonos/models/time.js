const playlists = require("../config/playlists/time.json");
const sonos = require("../models/sonos-api");
const getRandomItem = require("../utils").getRandomItem;

/**
 * @typedef {{name: string, id: string}} SpotifyItem
 */

/**
 * @param {'day'|'night'} timeId
 * @returns {SpotifyItem} The item played
 */
function playRandomFrom(timeId) {
	const randomItem = getRandomItem(playlists[timeId]);
	sonos.play(randomItem.id);

	return randomItem;
}

module.exports = {
	day: () => playRandomFrom("day"),
	night: () => playRandomFrom("night"),
	auto: () => {
		const hour = new Date().getHours();
		const timeId = hour > 9 && hour < 19 ? "day" : "night";
		const result = playRandomFrom(timeId);
		return { ...result, hour, time: timeId };
	},
};
