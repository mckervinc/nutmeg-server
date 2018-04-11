
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
    return knex('clubs').del()
        .then(function () {
        // Inserts seed entries
        return knex('clubs').insert([
            { opta_id: 't14', name: 'Liverpool', short_name: 'LIV' },
            { opta_id: 't43', name: 'Manchester City', short_name: 'MCI' },
            { opta_id: 't6', name: 'Tottenham Hotspur', short_name: 'TOT' },
            { opta_id: 't8', name: 'Chelsea', short_name: 'CHE' },
            { opta_id: 't1', name: 'Manchester United', short_name: 'MUN' },
            { opta_id: 't13', name: 'Leicester City', short_name: 'LEI' },
            { opta_id: 't110', name: 'Stoke City', short_name: 'STK' },
            { opta_id: 't31', name: 'Crystal Palace', short_name: 'CRY' },
            { opta_id: 't3', name: 'Arsenal', short_name: 'ARS' },
            { opta_id: 't36', name: 'Brighton and Hove Albion', short_name: 'BHA' },
            { opta_id: 't57', name: 'Watford', short_name: 'WAT' },
            { opta_id: 't90', name: 'Burnley', short_name: 'BRN' },
            { opta_id: 't38', name: 'Huddersfield Town', short_name: 'HUD' },
            { opta_id: 't4', name: 'Newcastle United', short_name: 'NEW' },
            { opta_id: 't11', name: 'Everton', short_name: 'EVE' },
            { opta_id: 't21', name: 'West Ham United', short_name: 'WHU' },
            { opta_id: 't91', name: 'Bournemouth', short_name: 'BOU' },
            { opta_id: 't80', name: 'Swansea', short_name: 'SWA' },
            { opta_id: 't35', name: 'West Bromwich Albion', short_name: 'WBA' },
            { opta_id: 't20', name: 'Southampton', short_name: 'SOU' },
        ]);
    });
};
