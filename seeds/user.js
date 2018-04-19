
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { first_name: 'testy',
            last_name: 'mctestface', 
            username: 'testy', 
            password: '$2a$10$jnPyUywvFdJFm8cN7N62T.weIQmmYu.L8Brj45ILGl8n1VaEbbwu.', 
            email: 'test@testymctestface.com'
        },
      ]);
    });
};
