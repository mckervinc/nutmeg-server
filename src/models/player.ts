import * as Sequelize from 'sequelize';
import { sequelize } from '../drivers';
import Club from './club'
import PlayerStat from './playerStat'

const TABLE_NAME = 'player' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    optaId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    shortName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    position: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nationality: {
        type: Sequelize.STRING
    },
    height: {
        type: Sequelize.INTEGER
    },
    weight: {
        type: Sequelize.INTEGER
    },
    realPosition: {
        type: Sequelize.STRING,
    },
    realPositionSide: {
        type: Sequelize.STRING,
    }
}

const OPTIONS = {
    paranoid: true,
}

const Player = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

Player.associate = (models) => {
    Player.hasMany(models.PlayerStat)
    Player.belongsTo(models.Club)
}
export default Player