
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('challenge_draft_order', table => {
            table.uuid('challenge_id').notNullable()
            table.integer('user_id').notNullable()
            table.integer('draft_order').notNullable()
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('challenge_draft_order')
    ])
};
