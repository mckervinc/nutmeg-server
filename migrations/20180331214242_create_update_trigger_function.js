
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.raw('CREATE OR REPLACE FUNCTION trigger_set_timestamp() \
                    RETURNS TRIGGER AS $$ \
                    BEGIN \
                        NEW.updated_at = NOW();\
                        RETURN NEW; \
                    END; \
                    $$ LANGUAGE plpgsql;'
        )
    ])
};

exports.down = function(knex, Promise) {
  
};
