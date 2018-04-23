import * as Sequelize from 'sequelize';
import { sequelize } from '../drivers';
import Club from './club'

const TABLE_NAME = 'player' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    optaId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'opta_id',
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    shortName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'short_name'
    },
    position: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        field: 'birth_date'
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
        field: 'real_position'
    },
    realPositionSide: {
        type: Sequelize.STRING,
        field: 'real_position_side'
    }
}

const OPTIONS = {
    paranoid: true,
    underscored: true
}

const Player = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)
Player.belongsTo(Club)

export default Player