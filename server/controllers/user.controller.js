const error = require('../services/common/exception.service');
const userService = require('../services/user/user.service');

/**
 * Get User by Id
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const getById = (req, res, next) => {
    const userId = req.params.id;

    // Get a user by id and return the user model
    userService.getById(userId).then((user) => {
        if (!user) {
            next(new error.NotFound());
            return;
        }

        res.json(user);
    }).catch((err) => {
        next(new error.ServerError(err, {
            user: userId
        }, 'Error getting user from database'));
    });
};

module.exports = {
    getById
};
