const express = require('express');

const router = express.Router();

router.use('/user',require('./users'));
router.use('/teacher',require('./teacher'));

module.exports = router;