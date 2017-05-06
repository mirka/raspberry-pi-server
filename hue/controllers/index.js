const router = require('express').Router();

router.use('/groups', require('./groups'));

module.exports = router;
