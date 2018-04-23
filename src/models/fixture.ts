import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'
import Club from './club'

const TABLE_NAME = 'fixture' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    optaId: {
        type: Sequelize.STRING,
        field: 'opta_id',
        unique: true
    },
    homeScore: {
        type: Sequelize.INTEGER,
        field: 'home_score'
    },
    awayScore: {
        type: Sequelize.INTEGER,
        field: 'away_score'
    },
    gameDate: {
        type: Sequelize.DATE,
        field: 'game_date'
    },
    week: {
        type: Sequelize.INTEGER
    }
}

const OPTIONS = {
    underscored: true,
}

const Fixture = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)
Fixture.belongsTo(Club, { as: 'Home' })
Fixture.belongsTo(Club, { as: 'Away' })

export default Fixture