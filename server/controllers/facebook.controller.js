const request = require('request');
const config = require('../config/env');
const apis = require('../config/apis');
const intentService = require('../services/intents/intent.service');

/**
 * Get the type of attachment from a fb message
 * @param {object} message object
 * @return {string} message type
 */
const getMessageType = (message) => {
    const attachType = message.message.attachments;
    let messageType = 'text';

    if (attachType && attachType[0].type) {
        messageType = attachType[0].type;
    }

    return messageType;
};

/**
 * Send message to FB user.
 * @param {object} message object to send
 * @return {undefined}
 */
const setBotSettingsFromConfigModel = (configModel) => {
    const formattedButtons = [];

    const addUrlButton = (title, url) => {
        formattedButtons.push({
            type: 'web_url',
            title,
            url
        });
    };

    const addPostbackButton = (title, payload) => {
        formattedButtons.push({
            type: 'postback',
            title,
            payload
        });
    };

    if (configModel.slot_one && configModel.slot_one_url) {
        if (configModel.slot_one_url.indexOf('http') > -1) {
            addUrlButton(configModel.slot_one, configModel.slot_one_url);
        } else {
            addPostbackButton(configModel.slot_one, configModel.slot_one_url);
        }
    }

    if (configModel.slot_two && configModel.slot_two_url) {
        if (configModel.slot_two_url.indexOf('http') > -1) {
            addUrlButton(configModel.slot_two, configModel.slot_two_url);
        } else {
            addPostbackButton(configModel.slot_two, configModel.slot_two_url);
        }
    }

    if (configModel.slot_three && configModel.slot_three_url) {
        if (configModel.slot_three_url.indexOf('http') > -1) {
            addUrlButton(configModel.slot_three, configModel.slot_three_url);
        } else {
            addPostbackButton(configModel.slot_three, configModel.slot_three_url);
        }
    }

    if (configModel.slot_four && configModel.slot_four_url) {
        if (configModel.slot_four_url.indexOf('http') > -1) {
            addUrlButton(configModel.slot_four, configModel.slot_four_url);
        } else {
            addPostbackButton(configModel.slot_four, configModel.slot_four_url);
        }
    }

    if (configModel.slot_five && configModel.slot_five_url) {
        if (configModel.slot_five_url.indexOf('http') > -1) {
            addUrlButton(configModel.slot_five, configModel.slot_five_url);
        } else {
            addPostbackButton(configModel.slot_five, configModel.slot_five_url);
        }
    }

    const messageData = {
        get_started: {
            payload: 'get started'
        }
    };

    if (formattedButtons.length) {
        messageData.persistent_menu = [{
            locale: 'default',
            call_to_actions: formattedButtons
        }, {
            locale: 'en_US',
            call_to_actions: formattedButtons
        }, {
            locale: 'en_GB',
            call_to_actions: formattedButtons
        }];
    }

    if (configModel.introduction) {
        messageData.greeting = [{
            locale: 'default',
            text: configModel.introduction
        }, {
            locale: 'en_US',
            text: configModel.introduction
        }, {
            locale: 'en_GB',
            text: configModel.introduction
        }];
    }

    return new Promise((resolve) => {
        request({
            uri: apis.facebook_messenger,
            qs: {
                access_token: config.facebook.token
            },
            method: 'POST',
            json: messageData
        }, () => {
            return resolve(configModel);
        });
    });
};


/**
 * Send message to FB user.
 * @param {object} message object to send
 * @return {undefined}
 */
const sendMessage = (message, senderId) => {
    const messageData = {
        recipient: {
            id: senderId
        },
        message
    };

    request({
        uri: apis.facebook_message,
        qs: {
            access_token: config.facebook.token
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            sender_action: 'typing_on'
        }
    }, () => {
        setTimeout(() => {
            request({
                uri: apis.facebook_message,
                qs: {
                    access_token: config.facebook.token
                },
                method: 'POST',
                json: messageData
            });
        }, 2000);
    });
};

/**
 * Get Profile from FB user
 * @param {int | string} facebook id
 * @return {object} response object
 */
const getUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        request({
            uri: apis.facebook_user + userId,
            qs: {
                access_token: config.facebook.token
            },
            method: 'GET',
        }, (error, response, body) => {
            // Check if the response is valid and the data type
            if (!error && response.statusCode === 200) {
                if (typeof body === 'string') {
                    resolve(JSON.parse(body));
                } else {
                    resolve(body);
                }
            } else {
                reject(error);
            }
        });
    });
};


/**
 * Webhook get used to verifiy token
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} render response
 */
const get = (req, res) => {
    if (req.query['hub.verify_token'] === config.facebook.verify) {
        return res.send(req.query['hub.challenge']);
    }

    return res.sendStatus(403);
};

/**
 * Facebook main webhook
 * @TODO Update to new structure
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} render response
 */
const processMessage = (req, res) => {
    const fbMessage = req.body;
    let lowercaseText;
    if (fbMessage.object === 'page') {
        fbMessage.entry.forEach((entry) => {
            entry.messaging.forEach((message) => {
                if (!message.delivery) {
                    if (message.postback) {
                        message.message = {
                            text: message.postback.payload
                        };
                    }

                    if (message.message.sticker_id === 369239263222822) {
                        message.message.text = 'yes';
                    }

                    lowercaseText = message.message.text.toLowerCase();

                    if (lowercaseText !== 'ok' && lowercaseText !== 'great' && lowercaseText !== 'good' && lowercaseText !== 'fine') {
                        if (message.message.text) {
                            intentService.getResponse(message.message.text, null, message.sender.id, 'facebook').then((result) => {
                                if (result.action === 'input.unknown') {
                                    result.answer.push(result.last_message);
                                }

                                const clone = JSON.parse(JSON.stringify(result));
                                for (let i = 0; i < result.answer.length; i += 1) {
                                    setTimeout((function outerloop(x, resp) {
                                        return function loop() {
                                            const response = resp;
                                            response.answer = result.answer[x];
                                            sendMessage(response.answer, message.sender.id);
                                        };
                                    }(i, clone)), 3500 * i);
                                }
                            });
                        } else {
                            let contentType = '';
                            if (message.message.attachments) {
                                contentType = ` ${message.message.attachments[0].type}`;
                            }
                            sendMessage({ text: `Thanks for that${contentType}!` }, message.sender.id);
                        }
                    }
                }
            });
        });
    }

    res.sendStatus(200);
};

module.exports = {
    processMessage,
    get,
    getMessageType,
    getUserProfile,
    sendMessage,
    setBotSettingsFromConfigModel
};
