const express = require('express');
const facebookController = require('../controllers/facebook.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/facebook', facebookController.processMessage);
router.get('/facebook', facebookController.get);

module.exports = router;
