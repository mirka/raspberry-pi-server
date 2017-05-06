const router = require('express').Router();

router.post('/:groupId', (req, res) => {
	res.send(req.params);
});

module.exports = router;
