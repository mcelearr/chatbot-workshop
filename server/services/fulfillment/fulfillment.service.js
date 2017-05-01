const messagesService = require('../common/messages.service');

/**
 * Return normal API.AI message
 * @param {string} message to process
 * @return {promise} message object
 */
const defaultAction = (messageObj) => {
    const messages = messageObj.result.fulfillment.messages;
    let contexts = '';
    let constructedMessages = [];

    if (messageObj.result && messageObj.result.contexts) {
        contexts = messageObj.result.contexts;
    }

    constructedMessages = messagesService.constructMessage(messages);

    return Promise.resolve({
        answer: constructedMessages,
        context: contexts
    });
};

/**
 * Process Action and return response
 * @param {string} action intent action
 * @param {string} message to process
 * @return {promise} message object
 */
const processAction = (action, messageObj, session) => {
    // Run the fulfillment function and return the result.
    return new Promise((resolve) => {
        defaultAction(messageObj, session).then((result) => {
            const returnObj = {
                question: messageObj,
                answer: result.answer,
                context: result.context,
                api: messageObj.result.contexts
            };

            if (result.payload) {
                returnObj.payload = result.payload;
            }

            resolve(returnObj);
        });
    });
};

module.exports = {
    processAction
};
