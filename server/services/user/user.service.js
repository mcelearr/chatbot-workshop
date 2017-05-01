const User = require('../../models/models').User;

/**
 * Get a user by Id
 * @param {int} user id
 * @return {promise} user model || error
 */
const getById = (userId) => {
    return User.forge().where('id', userId).fetch();
};

/**
 * Get a user by field object
 * @param {object} object of fields to search by
 * @return {promise} user model || error
 */
const get = (params) => {
    return User.forge(params).fetch();
};

/**
 * Create a new user
 * @param {object} object of fields to search by
 * @return {promise} user model || error
 */
const create = (params) => {
    return User.forge(params).save();
};

module.exports = {
    get,
    getById,
    create
};
