const router = require('express').Router();
const group = require('../models/group');

router.post('/:groupId/action', (req, res) => {
	const validValues = /^(toggle|smartToggle)$/;
	const groupId = req.params.groupId;

	// Reject empty or invalid requests
	if (!req.body.onOff || validValues.test(req.body.onOff) === false) {
		res.status(400)
			.send('Bad Request.\n' +
				'(Will respond to {"onOff": "toggle"} or {"onOff": "smartToggle"})');
		return;
	}

	group[req.body.onOff](groupId);
	res.sendStatus(200);
});

module.exports = router;
