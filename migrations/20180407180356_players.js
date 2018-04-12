
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('players', table => {
            table.increments('id').primary()
            table.string('opta_id').notNullable()
            table.string('name').notNullable()
            table.string('short_name').notNullable()
            table.string('position').notNullable()
            table.integer('club_id').notNullable()
            table.date('birth_date')
            table.string('country')
            table.string('nationality')
            table.integer('height')
            table.integer('weight')
            table.string('real_position')
            table.string('real_position_side')
            table.timestamps(true, true)
        }),
        // this step is so that the updated column updates
        knex.raw(
            'CREATE TRIGGER set_timestamp \
            BEFORE UPDATE ON players \
            FOR EACH ROW \
            EXECUTE PROCEDURE trigger_set_timestamp();'
        )
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('players_old'),
        knex.schema.renameTable('players', 'players_old')
    ])
};
