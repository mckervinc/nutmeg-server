import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'

const TABLE_NAME = 'standing' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    season: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'club_season_league'
    },
    league: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'club_season_league'
    },
    standingObj: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
    },
}

const OPTIONS = {
    paranoid: true,
}

const Standing = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

Standing.associate = (models) => {
    Standing.belongsTo(models.Club, { foreignKey: { unique: 'club_season_league' } })
}

export default Standing