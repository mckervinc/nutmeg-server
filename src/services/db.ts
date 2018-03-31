import * as knex from 'knex';
import * as pg from 'pg';
import * as createError from 'http-errors'

console.log('Connecting DB...')
pg.defaults.ssl = true

const connection = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
})

class DBService {
    public knex = connection

    async query(table: string, where = {}) {
        try {
            return await this.knex(table).where(where)
        } catch (err) {
            throw createError(503, 'Database error')
        }
    }

    async insert(table: string, what) {
        try {
            return await this.knex(table).insert(what).then(() => what)
        } catch (err) {
            throw createError(503, 'Database error')
        }
    }

    async update(table: string, where = {}, what = {}) {
        try {
            return await this.knex(table).where(where).update(what)
        } catch (err) {
            throw createError(503, 'Database error')
        }
    }

}

export default new DBService()