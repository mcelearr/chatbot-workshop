const local = require('passport-local');
const crypto = require('crypto');
const userService = require('./user.service');

const LocalStrategy = local.Strategy;
const invalidPassword = {
    message: 'Invalid password'
};

/**
 * Set the auth methord to use password local
 * @param {Passport} Passport module
 * @return {void}
 */
const set = (passport) => {
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser((userId, done) => {
        userService.getById(userId).then((user) => {
            return done(null, user);
        }).catch(() => {
            return done(null, false, invalidPassword);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        const searchObject = {
            email
        };

        userService.get(searchObject).then((user) => {
            if (!user) {
                return done(null, false);
            }

            const sa = user.get('salt');
            const pw = user.get('password');
            const upw = crypto.createHmac('sha1', sa).update(password).digest('hex');

            if (upw === pw) {
                return done(null, user);
            }

            return done(null, false, invalidPassword);
        }).catch(() => {
            return done(null, false, invalidPassword);
        });
    }));
};

module.exports = {
    set
};
