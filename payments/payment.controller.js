const express = require('express');
const router = express.Router();


// routes
router.use('/pos-payment', require('./pos/posPayment.controller'));
router.use('/insurer', require('./insurer/insPayment.controller'));

module.exports = router;

