
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('clubs', table => {
            table.increments('id').primary()
            table.string('opta_id').notNullable()
            table.string('name').notNullable()
            table.string('short_name').notNullable()
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('clubs')
    ])
};
