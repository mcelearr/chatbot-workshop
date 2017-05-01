const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/logout', authController.logout);
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
