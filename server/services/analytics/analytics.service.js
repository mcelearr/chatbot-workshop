const conversations = require('../../models/models').Conversation;

/**
 * Log a API.AI interaction
 * @param {object} intentResponse response object
 * @param {object} answerResponse response object
 * @param {string} channel
 * @param {string} indent string. Ip or platform id
 * @return {promise} analytics model || error
 */
const saveResponse = (intentResponse, answerResponse, channel, ident, context, apiContext) => {
    let responseType = 'text';

    // Format for DB
    const action = intentResponse.result.action ? intentResponse.result.action : null;

    // if no confidence, set to 0.
    const confidence = intentResponse.result.score ? intentResponse.result.score : 0;

    // if no intent, set to null;
    const intent = intentResponse.result.metadata ? intentResponse.result.metadata.intentName : null;

    // If no question, set to null.
    const question = intentResponse.result.resolvedQuery ? intentResponse.result.resolvedQuery : null;

    // convert true and false to binary.
    const slot = intentResponse.result.actionIncomplete ? 1 : 0;

    // convert API.Ai default response to known or unknown answer.
    const status = intentResponse.result.action === 'input.unknown' ? 'unanswered' : 'answered';

    if (answerResponse.attachment) {
        responseType = answerResponse.attachment.payload.template_type;
    }

    // Create message ensuring objects are stringified.
    const message = {
        action,
        answer: JSON.stringify(answerResponse),
        confidence,
        intent,
        question,
        response: JSON.stringify(intentResponse),
        session_id: intentResponse.sessionId,
        slot_completed: slot,
        status,
        response_type: responseType,
        emotion: 'neutral'
    };

    // Create the top level conversation modal.
    const conversation = {
        channel,
        identifier: ident,
        intent_provider: 'api-ai',
        session_id: intentResponse.sessionId,
        current_param: context.currentParam,
        last_param: context.lastParam,
        last_intent: context.lastIntent,
        contexts: JSON.stringify(apiContext)
    };

    if (action !== 'input.unknown') {
        conversation.last_message = JSON.stringify(answerResponse[answerResponse.length - 1]);
    }

    if (context.parameters) {
        if (typeof context.parameters !== 'string') {
            context.parameters = JSON.stringify(context.parameters);
        }

        conversation.parameters = context.parameters;
    }

    // Check if or a session exists or create one. Then attach the message.
    return conversations.forge({
        session_id: intentResponse.sessionId
    }).fetch().then((conversationModel) => {
        if (conversationModel) {
            return conversationModel.save(conversation).then(() => {
                return conversationModel.related('messages').create(message);
            });
        }
        return conversations.forge(conversation).save().then((newConversationModel) => {
            return newConversationModel.related('messages').create(message);
        });
    });
};

/**
 * Check for a session id via the conversation identifier
 * @param {string} string of conversation identifier
 * @return {object} db conversation model || null
 */
const getLastSessionForUser = (ident, sessionId) => {
    if (sessionId) {
        return conversations.forge()
            .query((qb) => {
                qb.where('session_id', sessionId)
                    .orderBy('created_at', 'desc')
                    .limit(1);
            }).fetchAll();
    }
    return conversations.forge()
        .query((qb) => {
            qb.where('identifier', ident)
                .orderBy('created_at', 'desc')
                .limit(1);
        }).fetchAll();
};

module.exports = {
    getLastSessionForUser,
    saveResponse
};
