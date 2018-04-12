
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('challenges', table => {
            table.uuid('id')
            table.integer('user_id').notNullable()
            table.integer('challenge_type_id').notNullable()
            table.boolean('is_host').notNullable()
            table.boolean('has_accepted').notNullable()
            table.integer('stakes_value')
            table.integer('stakes_emoji')
            table.timestamps(true, true)
        }),
        // this step is so that the updated column updates
        knex.raw(
            'CREATE TRIGGER set_timestamp \
            BEFORE UPDATE ON challenges \
            FOR EACH ROW \
            EXECUTE PROCEDURE trigger_set_timestamp();'
        )
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('challenges')
    ])
};
