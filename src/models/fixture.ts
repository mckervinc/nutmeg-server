import * as Sequelize from 'sequelize'
import sequelize from '../drivers/sequelize'
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
    },
    isComplete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}

const OPTIONS = {
    paranoid: true
}

const Fixture = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

Fixture.associate = (models) => {
    Fixture.belongsTo(models.Club, { as: 'home' })
    Fixture.belongsTo(models.Club, { as: 'away' })
    Fixture.hasMany(models.ChallengeType)
    Fixture.hasMany(models.PlayerStat)
}
export default Fixture