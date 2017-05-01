const request = require('request');
const uuid = require('uuid');
const analyticsService = require('../analytics/analytics.service');
const apis = require('../../config/apis');
const config = require('../../config/env');
const fulfillmentService = require('../fulfillment/fulfillment.service');

const apiToken = config.apiai.client;

/**
 * get intent from API.AI
 * @param {string} message to process
 * @param {string} sessionId of current session
 * @param {string} country code of lang used
 * @return {promise} api.ai response || error
 */
const getIntent = (message, sessionId, lang = 'en', contexts = []) => {
    // If no sessionId is set, create a new one.
    if (!sessionId) {
        sessionId = uuid.v1(); // eslint-disable-line
    }

    if (message.length > 254) {
        message = message.slice(254); // eslint-disable-line
    }

    const requestBody = {
        lang,
        query: encodeURIComponent(message),
        sessionId,
        contexts
    };

    // Send user text to API.AI and return the intent
    return new Promise((resolve, reject) => {
        request({
            uri: apis.apiai_message,
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            qs: { v: apis.apiai_version },
            method: 'POST',
            json: requestBody
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let result = body;
                if (typeof body === 'string') {
                    result = JSON.parse(body);
                }
                result.message = message;
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

/**
 * Process Intent and return speech response
 * @param {object} api response
 * @return {promise} user model || error
 */
const processIntent = (apiResponse, session) => {
    let action = apiResponse.result.action;

    // Set all unfinished slotfilling or empty actions to incomplete to return default answers.
    if (!action || action === 'answer.faq' || action === 'input.unknown') {
        action = 'incomplete';
    }

    // Process the intent and return the response.
    return fulfillmentService.processAction(action, apiResponse, session);
};

/**
 * return a web response from intent and fulfillment.
 * @param {string} string message to be processed
 * @param {string} id of the session
 * @param {string} identifier
 * @param {string} channel
 * @return {promise} fulfilled message to return
 */
const getResponse = (message, sessionId, identifier, channel) => {
    let sessionObj;
    let payload = false;
    let contexts = false;

    // Check if we have a session on the go
    return analyticsService.getLastSessionForUser(identifier, sessionId)

        // Get intent from message
        .then((session) => {
            if (session && session.length) {
                sessionObj = session.toJSON()[0];

                if (!sessionId && sessionObj) {
                    sessionId = sessionObj.session_id; // eslint-disable-line
                }

                if (sessionObj.contexts) {
                    contexts = JSON.parse(sessionObj.contexts);
                }
            }
            return getIntent(message, sessionId, false, contexts);
        })

        // Process Intent
        .then((apiResponse) => {
            return processIntent(apiResponse, sessionObj);
        })

        // Log request
        .then((result) => {
            payload = result.payload;
            return analyticsService.saveResponse(result.question, result.answer, channel, identifier, result.context, result.api);
        })

        // return response
        .then((dbModel) => {
            dbModel = dbModel.toJSON(); // eslint-disable-line
            dbModel.payload = payload;

            if (sessionObj && sessionObj.last_message) {
                dbModel.last_message = JSON.parse(sessionObj.last_message);
            }

            dbModel.answer = JSON.parse(dbModel.answer);
            return Promise.resolve(dbModel);
        })

        // Catch all the things
        .catch((err) => {
            return Promise.reject(err);
        });
};

module.exports = {
    getIntent,
    processIntent,
    getResponse
};
