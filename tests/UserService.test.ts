import 'jest'
import * as dotenv from 'dotenv';
dotenv.config();

import db from '../src/drivers/db'
import UserService from '../src/services/UserService';

describe('UserService tests', () => {
    test('successful new user created', async done => {
        const user = await UserService.createUser({
            username: 'test_username',
            first_name: 'testy',
            last_name: 'test',
            password: 'password',
            email: 'veryuniqueemailnoonewillhave@veryunique.com'
        })
        const id = user.id
        expect(id).toBeTruthy()

        // teardown if successful
        if (id) {
            db.delete('users', { id } )
            db.knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH ?', [id - 1])
        }
        done()
    })
})