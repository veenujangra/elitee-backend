const express = require('express');
const router = express.Router();

router.use('/categories', require('./categories/category.controller'));
router.use('/makes', require('./makes/make.controller'));
router.use('/models', require('./models/model.controller'));


module.exports = router;

