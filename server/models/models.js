const Bookshelf = require('../config/database');

Bookshelf.plugin('pagination');
Bookshelf.plugin('visibility');

/**
 * Message Modal
 */
const Configuration = Bookshelf.Model.extend({
    tableName: 'configuration'
});

/**
 * Conversation Modal
 */
const Conversation = Bookshelf.Model.extend({
    tableName: 'conversations',
    hasTimestamps: true,
    messages: function () {  // eslint-disable-line
        return this.hasMany(Message); // eslint-disable-line
    }
});

/**
 * Message Modal
 */
const Message = Bookshelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    conversations: function() { // eslint-disable-line
        return this.belongsTo(Conversation);
    }
});

/**
 * User Modal
 */
const User = Bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    hidden: ['password', 'salt']
});

module.exports = {
    Configuration,
    Conversation,
    Message,
    User
};
