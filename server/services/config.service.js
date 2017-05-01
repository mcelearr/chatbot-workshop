const configuration = require('../models/models').Configuration;

/**
 * Get config
 * @return {object} combined object of totals
 */
const getConfig = () => {
    return configuration.forge()
        .query((qb) => {
            qb.limit(1);
        }).fetchAll();
};

/**
 * Get config
 * @return {object} combined object of totals
 */
const saveConfig = (data) => {
    return configuration.forge()
        .query((qb) => {
            qb.limit(1);
        }).fetchAll().then((configurationModel) => {
            if (configurationModel) {
                configurationModel = configurationModel.at(0); // eslint-disable-line
                return configurationModel.save(data);
            }

            return configuration.forge(data).save();
        });
};


module.exports = {
    getConfig,
    saveConfig
};
