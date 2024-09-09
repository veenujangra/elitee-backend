const express = require('express');
const router = express.Router();

router.use('/fire', require('./fire/fire.controller'));
router.use('/health', require('.//health/health.controller'));
router.use('/marine', require('./marine/marine.controller'));
router.use('/motor', require('./motor/motor.controller'));


module.exports = router;

