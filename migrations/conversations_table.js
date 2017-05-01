exports.up = function(knex, Promise) {
    return knex.schema.createTable('conversations', function(table) {
        table.increments('id').primary();
        table.string('session_id', 255).nullable();
        table.string('channel', 255).nullable();
        table.string('intent_provider', 255).nullable();
        table.string('identifier', 255).nullable();
        table.string('current_param', 255).nullable();
        table.string('last_param', 255).nullable();
        table.string('last_intent', 255).nullable();
        table.text('contexts').nullable();
        table.text('parameters').nullable();
        table.text('last_message').nullable();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('conversations');
};
