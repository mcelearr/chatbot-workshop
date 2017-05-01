const winston = require('winston');

const env = process.env.NODE_ENV || 'development';

winston.add(winston.transports.File, {
    filename: 'common.log',
    level: 'info',
    json: true,
    eol: '\n',
    timestamp: true
});

/**
 * Return errors as json responses
 * @param {object} custom err object
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const errors = (err, req, res) => {
    if (err && env !== 'development') {
        winston.log('error', err);
    } else if (err && env === 'development') {
        console.log(err); // eslint-disable-line
    }

    if (res) {
        res.status(500).send({
            error: {
                status: err.statusCode || 500,
                message: err.message || 'Error'
            }
        });
    }
};

module.exports = {
    errors
};
