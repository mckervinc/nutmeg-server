import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'

const TABLE_NAME = 'challenge' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    isHost: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    hasAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    stakesValue: {
        type: Sequelize.INTEGER,
    },
    stakesEmoji: {
        type: Sequelize.STRING,
    }
}

const OPTIONS = {
    paranoid: true,
}

const Challenge = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

Challenge.associate = (models) => {
    Challenge.belongsTo(models.User)
    Challenge.belongsTo(models.ChallengeType)

}

export default Challenge