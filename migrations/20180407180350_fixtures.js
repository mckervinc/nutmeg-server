
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('fixtures', table => {
            table.increments('id').primary()
            table.string('opta_id').notNullable()
            table.string('home').notNullable()
            table.string('away').notNullable()
            table.integer('home_score').notNullable()
            table.integer('away_score').notNullable()
            table.date('game_date')
            table.integer('week').notNullable()
            table.timestamps(true, true)
        }),
            // this step is so that the updated column updates
        knex.raw(
            'CREATE TRIGGER set_timestamp \
            BEFORE UPDATE ON fixtures \
            FOR EACH ROW \
            EXECUTE PROCEDURE trigger_set_timestamp();'
        )     
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('fixtures_old'),
        knex.schema.renameTable('fixtures', 'fixtures_old')    ])
};
