import * as Sequelize from 'sequelize'
import sequelize from '../drivers/sequelize'

const TABLE_NAME = 'challenge_detail' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    playerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'players',
            key: 'id'
        }
    },
    draftIndex: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}

const OPTIONS = {
    paranoid: true,
    timestamps: false
}

const ChallengeDetail = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)

ChallengeDetail.associate = (models) => {
    ChallengeDetail.belongsTo(models.Challenge)
}

export default ChallengeDetail