
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('player_stats', table => {
            table.increments('id').primary()
            table.integer('player_id').notNullable()
            table.integer('fixture_id').notNullable()
            table.boolean('is_home').notNullable()
            table.boolean('is_starter').notNullable()
            table.integer('assists').notNullable()
            table.integer('aerials_won').notNullable()
            table.integer('key_passes').notNullable()
            table.integer('clearances').notNullable()
            table.integer('clean_sheets').notNullable()
            table.integer('dispossessions').notNullable()
            table.integer('goals').notNullable()
            table.integer('goals_conceded').notNullable()
            table.integer('interceptions').notNullable()
            table.integer('minutes').notNullable()
            table.integer('own_goals').notNullable()
            table.integer('penalty_saves').notNullable()
            table.integer('red_cards').notNullable()
            table.integer('successful_crosses').notNullable()
            table.integer('shots_on_target').notNullable()
            table.integer('successful_touches').notNullable()
            table.integer('saves').notNullable()
            table.integer('tackles_won').notNullable()
            table.integer('yellow_cards').notNullable()
            table.timestamps(true, true)
        }),
        // this step is so that the updated column updates
        knex.raw(
            'CREATE TRIGGER set_timestamp \
            BEFORE UPDATE ON player_stats \
            FOR EACH ROW \
            EXECUTE PROCEDURE trigger_set_timestamp();'
        )
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('player_stats')
    ])
};
