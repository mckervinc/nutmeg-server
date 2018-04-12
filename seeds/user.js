
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {first_name: 'testy', last_name: 'mctestface', username: 'testy', password: 'password', email: 'test@testymctestface.com'},
      ]);
    });
};
