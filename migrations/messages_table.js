exports.up = function(knex, Promise) {
    return knex.schema.createTable('messages', function(table) {
        table.increments('id').primary();
        table.text('response').nullable();
        table.float('confidence').nullable();
        table.string('status', 255).nullable();
        table.string('action', 255).nullable();
        table.string('intent', 255).nullable();
        table.text('question').nullable();
        table.text('answer').nullable();
        table.string('session_id', 255).nullable();
        table.integer('conversation_id').nullable();
        table.boolean('slot_completed').defaultTo(false);
        table.boolean('intent_corrected').defaultTo(false);
        table.string('response_type').defaultTo(false);
        table.string('emotion').defaultTo('neutral');
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('messages');
};
