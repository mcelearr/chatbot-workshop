const util = require('util');

/**
 * Not found exception
 * @param {object} error message object
 * @param {object} stash object of related info
 * @param {string} string message if you want to override default
 * @param {int} error code to use
 * @return {exception}
 */
function NotFound(err, stash, message, errorCode) {
    this.name = this.constructor.name;
    this.message = message || 'The requested resource could not be found';
    this.statusCode = 404;
    this.errorCode = errorCode || 404;
    this.stash = stash || {};
    this.log = err;
}

/**
 * Server error exception
 * @param {object} error message object
 * @param {object} stash object of related info
 * @param {string} string message if you want to override default
 * @param {int} error code to use
 * @return {exception}
 */
function ServerError(err, stash, message, errorCode) {
    this.name = this.constructor.name;
    this.message = message || 'Internal Server Error';
    this.statusCode = 500;
    this.errorCode = errorCode || 500;
    this.stash = stash || {};
    this.log = err;
}

/**
 * Invalid post/get params
 * @param {object} error message object
 * @param {object} stash object of related info
 * @param {string} string message if you want to override default
 * @param {int} error code to use
 * @return {exception}
 */
function InvalidParams(err, stash, message, errorCode) {
    this.name = this.constructor.name;
    this.message = message || 'Invalid params';
    this.statusCode = 500;
    this.errorCode = errorCode || 500;
    this.stash = stash || {};
    this.log = err;
}

/**
 * Duplicate model in the db exception
 * @param {object} error message object
 * @param {object} stash object of related info
 * @param {string} string message if you want to override default
 * @param {int} error code to use
 * @return {exception}
 */
function DuplicateModel(err, stash, message, errorCode) {
    this.name = this.constructor.name;
    this.message = message || 'Duplicate model';
    this.statusCode = 500;
    this.errorCode = errorCode || 500;
    this.stash = stash || {};
    this.log = err;
}

/**
 * Access denied exception
 * @param {object} error message object
 * @param {object} stash object of related info
 * @param {string} string message if you want to override default
 * @param {int} error code to use
 * @return {exception}
 */
function AccessDenied(err, stash, message, errorCode) {
    this.name = this.constructor.name;
    this.message = message || 'You do not have access';
    this.statusCode = 500;
    this.errorCode = errorCode || 500;
    this.stash = stash || {};
    this.log = err;
}

// Register custom exceptions as express errors
util.inherits(NotFound, Error);
util.inherits(ServerError, Error);
util.inherits(DuplicateModel, Error);
util.inherits(AccessDenied, Error);
util.inherits(InvalidParams, Error);

module.exports = {
    AccessDenied,
    DuplicateModel,
    InvalidParams,
    NotFound,
    ServerError
};
