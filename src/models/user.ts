import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'

const TABLE_NAME = 'user' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name'
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name'
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
    underscored: true
}

const User = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

export default User