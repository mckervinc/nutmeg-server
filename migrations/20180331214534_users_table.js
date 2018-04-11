
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', table => {
            table.increments('id').primary()
            table.string('first_name').notNullable()
            table.string('last_name').notNullable()
            table.string('username').notNullable()
            table.string('password').notNullable()
            table.string('email').notNullable()
            table.timestamps(true, true)
        }),
        // this step is so that the updated column updates
        knex.raw(
            'CREATE TRIGGER set_timestamp \
            BEFORE UPDATE ON users \
            FOR EACH ROW \
            EXECUTE PROCEDURE trigger_set_timestamp();'
        )
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users')
    ])
};
