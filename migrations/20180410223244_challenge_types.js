
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('challenge_types', table => {
            table.increments('id').primary()
            table.integer('fixture_id')
            table.string('title').notNullable()
            table.string('image_url')
            table.date('expired_date')
            table.timestamps(true, true)
        }),
        // this step is so that the updated column updates
        knex.raw(
            'CREATE TRIGGER set_timestamp \
            BEFORE UPDATE ON challenge_types \
            FOR EACH ROW \
            EXECUTE PROCEDURE trigger_set_timestamp();'
        )
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('challenge_types')
    ])
};