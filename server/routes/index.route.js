const express = require('express');
const authRoutes = require('./auth.route');
const defaultController = require('../controllers/default.controller');
const webhookRoutes = require('./webhook.route');
const webRoutes = require('./web.route');
const configRoutes = require('./config.route');

const router = express.Router(); // eslint-disable-line new-cap

// mount api ai fulfilment routes
router.get('/chat', defaultController.getChat);
router.use('/api/webhook', webhookRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/web', webRoutes);
router.use('/api/config', configRoutes);
router.get('/portal', defaultController.getPrivate);
router.get('*', defaultController.get);

module.exports = router;
