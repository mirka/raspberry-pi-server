const http = require("http");
const config = require("../config");

const sonos = {
	/**
	 * @param {string} itemId
	 * @param {string} roomId
	 */
	play: (itemId, roomId = config.CONTROLLER_ROOM) => {
		return http
			.get(`${config.API_BASE_URL}/${roomId}/clearqueue`, () =>
				http.get(`${config.API_BASE_URL}/${roomId}/spotify/now/${itemId}`)
			)
			.on("error", console.error);
	},
};

module.exports = sonos;
