const NodeCache = require('node-cache');
let cache;

module.exports = {
	init: () => {
		if (cache) return;
		cache = new NodeCache();
	},
	getInstance: () => {
		return cache;
	},
};
