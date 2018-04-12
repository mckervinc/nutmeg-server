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
            console.log(err)
            throw createError(503, 'Database error')
        }
    }

    async queryOne(table: string, where = {}) {
        const result = await this.query(table, where)
        if (!result.length) return null

        return result[0]
    }

    async insert(table: string, what) {
        try {
            return await this.knex(table).insert(what).returning('*').then(result => result[0])
        } catch (err) {
            console.log(err)
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

    async delete(table: string, where = {}) {
        try {
            return await this.knex(table).where(where).del()
        } catch (err) {
            throw createError(503, 'Database error')
        }
    }

    async raw(query) {
        const result = await this.knex.raw(query)
        return result.rows
    }

}

export default new DBService()