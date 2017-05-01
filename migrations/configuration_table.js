exports.up = function(knex, Promise) {
    return knex.schema.createTable('configuration', function(table) {
        table.increments('id').primary();
        table.string('bot_name', 255).nullable();
        table.string('brand_colour', 255).nullable();
        table.string('font_colour', 255).nullable();
        table.string('avatar', 255).nullable();
        table.text('introduction').nullable();
        table.string('slot_one', 255).nullable();
        table.string('slot_one_url', 255).nullable();
        table.string('slot_two', 255).nullable();
        table.string('slot_two_url', 255).nullable();
        table.string('slot_three', 255).nullable();
        table.string('slot_three_url', 255).nullable();
        table.string('slot_four', 255).nullable();
        table.string('slot_four_url', 255).nullable();
        table.string('slot_five', 255).nullable();
        table.string('slot_five_url', 255).nullable();
    });
};
exports.down = function(knex, Promise) {
    return knex.schema.dropTable('configuration');
};
