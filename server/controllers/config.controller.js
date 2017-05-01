const error = require('../services/common/exception.service');
const configService = require('../services/config.service');
const facebookController = require('./facebook.controller');


/**
 * Get Bot config
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const getConfig = (req, res, next) => {
    configService.getConfig().then((result) => {
        return res.json(result);
    }).catch((err) => {
        return next(new error.ServerError(err));
    });
};


/**
 * save config settings
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const saveConfig = (req, res, next) => {
    facebookController.setBotSettingsFromConfigModel(req.body)
        .then(configService.saveConfig)
        .then((result) => {
            return res.json(result);
        }).catch((err) => {
            return next(new error.ServerError(err));
        });
};

module.exports = {
    getConfig,
    saveConfig
};
