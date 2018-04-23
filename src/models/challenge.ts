import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'
import User from './user'
import ChallengeType from './challenge_type'

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
        field: 'is_host'
    },
    hasAccepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: 'has_accepted'
    },
    stakesValue: {
        type: Sequelize.INTEGER,
        field: 'stakes_value'
    },
    stakesEmoji: {
        type: Sequelize.STRING,
        field: 'stakes_emoji'
    }
}

const OPTIONS = {
    paranoid: true,
    underscored: true
}

const Challenge = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)
Challenge.belongsTo(User)
Challenge.belongsTo(ChallengeType, { as: 'ChallengeType', foreignKey: 'challenge_type_id' })

export default Challenge