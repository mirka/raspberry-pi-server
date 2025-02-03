const router = require("express").Router();

const time = require("../models/time");

router.get("/auto", (req, res) => {
	const result = time.auto();
	res.status(200).send(result);
});

router.get("/:timeId", (req, res) => {
	const result = time[req.params.timeId]();
	res.status(200).send(result);
});

module.exports = router;
