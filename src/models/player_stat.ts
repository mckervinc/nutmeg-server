import * as Sequelize from 'sequelize'
import { sequelize } from '../drivers'
import Fixture from './fixture'
import Player from './player'

const TABLE_NAME = 'player_stat' // sequelize will automatically make this plural

const FIELDS: Sequelize.DefineAttributes = {
    isHome: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        field: 'is_home'
    },
    isStarter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        field: 'is_starter'
    },
    stats: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
    }
}

const OPTIONS = {
    paranoid: true,
    underscored: true
}

const PlayerStat = sequelize.define(TABLE_NAME, FIELDS, OPTIONS)
PlayerStat.belongsTo(Player)
PlayerStat.belongsTo(Fixture)

export default PlayerStat