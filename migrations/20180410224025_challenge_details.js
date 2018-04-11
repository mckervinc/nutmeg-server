
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('challenge_details', table => {
            table.uuid('challenge_id').notNullable()
            table.integer('user_id').notNullable()
            table.integer('player_id').notNullable()
            table.integer('draft_order').notNullable()
            table.timestamps(true, true)
        }),
        // this step is so that the updated column updates
        knex.raw(
            'CREATE TRIGGER set_timestamp \
            BEFORE UPDATE ON challenge_details \
            FOR EACH ROW \
            EXECUTE PROCEDURE trigger_set_timestamp();'
        )
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('challenge_details')
    ])
};
