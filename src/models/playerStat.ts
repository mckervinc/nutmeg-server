import * as Sequelize from 'sequelize'
import sequelize from '../drivers/sequelize'

const TABLE_NAME = 'player_stat' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    isHome: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    isStarter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    stats: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
    }
}

const OPTIONS = {
    paranoid: true,
}

const PlayerStat = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

PlayerStat.associate = (models) => {
    PlayerStat.belongsTo(models.Player, { foreignKey: { unique: 'player_fixture' } })
    PlayerStat.belongsTo(models.Fixture, { foreignKey: { unique: 'player_fixture' } })

}

export default PlayerStat