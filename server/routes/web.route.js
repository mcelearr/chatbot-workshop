const express = require('express');
const webController = require('../controllers/web.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/message', webController.processMessage);


module.exports = router;
