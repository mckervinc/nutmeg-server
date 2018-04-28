import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'

const TABLE_NAME = 'challenge_type' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
    },
    expiredDate: {
        type: Sequelize.DATE,
    }
}

const OPTIONS = {
    paranoid: true,
}

const ChallengeType = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

ChallengeType.associate = (models) => {
    ChallengeType.belongsTo(models.Fixture)
    ChallengeType.hasMany(models.Challenge)
}

export default ChallengeType