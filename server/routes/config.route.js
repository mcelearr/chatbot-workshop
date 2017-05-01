const express = require('express');
const configController = require('../controllers/config.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.get('', configController.getConfig);
router.post('', configController.saveConfig);

module.exports = router;
