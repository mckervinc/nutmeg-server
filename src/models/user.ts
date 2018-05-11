import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'

const TABLE_NAME = 'user' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [5, 30] // arbitrary max len for username
        },
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}

const OPTIONS = {
    paranoid: true,
}

const User: any = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

User.associate = (models) => {
    User.hasMany(models.Challenge)
}

export default User