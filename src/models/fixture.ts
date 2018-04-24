import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'
import Club from './club'

const TABLE_NAME = 'fixture' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    optaId: {
        type: Sequelize.STRING,
        unique: true
    },
    homeScore: {
        type: Sequelize.INTEGER,
    },
    awayScore: {
        type: Sequelize.INTEGER,
    },
    gameDate: {
        type: Sequelize.DATE,
    },
    week: {
        type: Sequelize.INTEGER
    }
}

const OPTIONS = {
    paranoid: true
}

const Fixture = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

Fixture.associate = (models) => {
    Fixture.belongsTo(models.Club, { foreignKey: 'home' })
    Fixture.belongsTo(models.Club, { foreignKey: 'away' })

}
export default Fixture