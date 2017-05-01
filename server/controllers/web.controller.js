const intentService = require('../services/intents/intent.service');
const error = require('../services/common/exception.service');

/**
 * Process Message and return response
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} render response
 */
const processMessage = (req, res, next) => {
    const message = req.body.message;
    const sessionId = req.body.sessionId;

    if (!message) {
        return next(new error.InvalidParams(null, null, 'No message detected'));
    }

    // Resolve the users question and send back the response.
    return intentService.getResponse(message, sessionId, req.ip).then((result) => {
        return res.json(result);
    }).catch((err) => {
        return next(new error.ServerError(err, message));
    });
};


module.exports = {
    processMessage
};
