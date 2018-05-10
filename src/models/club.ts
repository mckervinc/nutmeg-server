import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'

const TABLE_NAME = 'club' // sequelize will automatically make this plural

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
        unique: true
    }
}

const OPTIONS = {
    paranoid: true,
    timestamps: false,
}

const Club = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

Club.associate = (models) => {
    Club.hasMany(models.Player)
    Club.hasMany(models.Standing)
}

export default Club