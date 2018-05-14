import * as Sequelize from 'sequelize';
import * as pg from 'pg';

pg.defaults.ssl = true
const sequelize = new Sequelize(process.env.DATABASE_URL)
sequelize.options.logging = false

export default sequelize;