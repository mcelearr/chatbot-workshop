const passport = require('passport');
const sanitizer = require('sanitizer');
const crypto = require('crypto');
const error = require('../services/common/exception.service');
const userService = require('../services/user/user.service');

/**
 * Logout a user
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const logout = (req, res) => {
    req.logout();

    return res.json({
        status: 'logged out'
    });
};

/**
 * Login a user
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const login = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (!user || err) {
            next(new error.AccessDenied(err));
            return;
        }

        req.logIn(user, (logErr) => {
            if (logErr) {
                next(new error.ServerError(logErr));
                return;
            }
            res.json(user);
        });
    })(req, res, next);
};

/**
 * Register a user
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const register = (req, res, next) => {
    const password = sanitizer.sanitize(req.body.password);
    const email = sanitizer.sanitize(req.body.email);

    const newSalt = Math.round((new Date().valueOf() * Math.random())).toString();
    const passwordHashed = crypto.createHmac('sha1', newSalt).update(password).digest('hex');
    const searchParams = {
        email
    };
    const saveParams = {
        email,
        password: passwordHashed,
        salt: newSalt
    };
    userService.get(searchParams).then((user) => {
        if (user) {
            next(new error.DuplicateModel());
            return;
        }
        userService.create(saveParams).then((newUser) => {
            if (newUser) {
                login(req, res, next);
            }
        }).catch((err) => {
            next(new error.ServerError(err));
        });
    }).catch((err) => {
        next(new error.ServerError(err));
    });
};

module.exports = {
    login,
    register,
    logout
};
