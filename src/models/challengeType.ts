import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'
import Fixture from './fixture'

const TABLE_NAME = 'challenge_type' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        field: 'image_url'
    },
    expiredDate: {
        type: Sequelize.DATE,
        field: 'expired_date'
    }
}

const OPTIONS = {
    paranoid: true,
    underscored: true
}

const ChallengeType = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)
ChallengeType.belongsTo(Fixture)

export default ChallengeType