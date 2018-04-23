import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'

const TABLE_NAME = 'club' // sequelize will automatically make this plural

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
        field: 'short_name',
        unique: true
    }
}

const OPTIONS = {
    underscored: true,
    timestamps: false,
}

const Club = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

export default Club