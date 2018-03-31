import 'jest'
import * as dotenv from 'dotenv';
dotenv.config();
import db from '../src/services/db'

describe('DB Connection Tests', () => {
    test('Connection works', async () => {
        const result = await db.knex.raw('SELECT ?::text as message', ['Hello world!'])
        expect(result.rows[0].message).toBe('Hello world!')
    })

})