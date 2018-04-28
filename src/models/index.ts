import Challenge from './challenge'
import ChallengeType from './challengeType'
import Club from './club'
import Fixture from './fixture'
import Player from './player'
import PlayerStat from './playerStat'
import User from './user'
import { sequelize } from '../drivers'

const db = {
    Challenge,
    ChallengeType,
    Club,
    Fixture,
    Player,
    PlayerStat,
    User,
    sequelize
}

Object.keys(db).forEach((key: any) => {
    if (db[key].associate) {
        db[key].associate(db)
    }
})

export default db