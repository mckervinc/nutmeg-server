import * as Sequelize from 'sequelize'
import sequelize from '../drivers/sequelize'

const TABLE_NAME = 'feed' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    link: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING,
        defaultValue: 'other'
    },
    createdAt: {
        type: Sequelize.DATE
    }
}

const OPTIONS = {
    paranoid: true,
    timestamps: false,
}

const Feed = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

// Feed.associate = (models) => {

// }

export default Feed