const HueApi = require('node-hue-api').HueApi;
const config = require('../config');

module.exports = new HueApi(config.hue.bridge.ip, config.hue.bridge.username);
