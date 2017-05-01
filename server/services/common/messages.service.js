/**
 * UTF8 encode text
 * @param {string} s to encode
 * @return {string} utf 8 encoded string
 */
const encodeUtf8 = (s) => {
    return s; // unescape(encodeURIComponent(s));
};


/**
 * Construct text based message
 * @param {string} message to send
 * @param {string} channel to use
 * @return {object}
 */
const constructTextMessage = (message) => {
    return {
        text: encodeUtf8(message)
    };
};

/**
 * Construct Image based message
 * @param {string} image url to send
 * @param {string} channel to use
 * @return {object}
 */
const constructImageMessage = (imageUrl) => {
    return {
        attachment: {
            type: 'image',
            payload: {
                url: imageUrl
            }
        }
    };
};

/**
 * Construct Gallery based message
 * @param {string} image url to send
 * @param {string} channel to use
 * @return {object}
 * @example
 *  { title: "Welcome to Peter\'s Hats", image_url: "https://petersfancybrownhats.com/company_image.png", subtitle: "We\'ve got the right hat for everyone.",
 *   buttons: [{type: "web_url",url: "https://petersfancybrownhats.com",title: "View Website"}]}
 */
const constructGalleryMessage = (elements) => {
    const formattedElements = [];

    if (!Array.isArray(elements)) {
        elements = [elements];
    }

    elements.forEach((element) => {
        const formattedElement = {
            title: element.title,
            image_url: element.imageUrl.replace('http:', 'https:')
        };

        if (element.subtitle && element.subtitle.length > 2) {
            formattedElement.subtitle = element.subtitle;
        }

        if (element.buttons && element.buttons.length) {
            let button;
            let buttonType = 'postback';

            formattedElement.buttons = [];

            element.buttons.forEach((item) => {
                buttonType = item.postback.indexOf('http') > -1 ? 'web_url' : 'postback';

                button = {
                    type: buttonType,
                    title: encodeUtf8(item.text)
                };

                if (buttonType === 'web_url') {
                    button.url = item.postback;
                } else {
                    button.payload = item.postback;
                }

                formattedElement.buttons.push(button);
            });
        }

        formattedElements.push(formattedElement);
    });

    return {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: formattedElements
            }
        }
    };
};


/**
 * Construct a quick reply based message
 * @param {string} message to send
 * @param {array} array of quick reply button objects
 * @return {object}
 * @example: var buttons = ['yes', 'no']
 */
const constructQuickReplyMessage = (message, buttons) => {
    const formattedButtons = [];

    if (!Array.isArray(buttons)) {
        buttons = [buttons];
    }

    buttons.forEach((item) => {
        formattedButtons.push({
            content_type: 'text',
            title: encodeUtf8(item),
            payload: item
        });
    });

    return {
        text: encodeUtf8(message),
        quick_replies: formattedButtons
    };
};

/**
 * Construct text based message
 * @param {string} message to send
 * @param {array} array of button objects
 * @return {object}
 * @example: var buttons = [{type: 'postback',title: 'Here you go!',payload: 'Here you go!'}];
 */
const constructButtonMessage = (message, buttons) => {
    const formattedButtons = [];

    if (!Array.isArray(buttons)) {
        buttons = [buttons];
    }

    buttons.forEach((item) => {
        formattedButtons.push({
            content_type: 'text',
            title: encodeUtf8(item),
            payload: item
        });
    });

    return {
        attachment: {
            type: 'template',
            payload: {
                buttons,
                template_type: 'button',
                text: encodeUtf8(message)
            }
        }
    };
};

/**
 * Construct text based message
 * @param {string} message to send
 * @param {string} channel to use
 * @return {object}
 */
const constructMessage = (messages) => {
    const constructedMessages = [];

    messages.forEach((message) => {
        switch (message.type) {
            case 1:
                constructedMessages.push(constructGalleryMessage(message));
                break;
            case 2:
                constructedMessages.push(constructQuickReplyMessage(message.title, message.replies));
                break;
            case 3:
                constructedMessages.push(constructImageMessage(message.imageUrl));
                break;
            case 4:
                constructedMessages.push(message.payload.facebook);
                break;
            default:
                constructedMessages.push(constructTextMessage(message.speech));
                break;
        }
    });

    return constructedMessages;
};


module.exports = {
    constructButtonMessage,
    constructQuickReplyMessage,
    constructTextMessage,
    constructImageMessage,
    constructGalleryMessage,
    constructMessage
};
