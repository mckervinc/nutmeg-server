import models from '../models'
import { Op } from 'sequelize'
const {
    Player,
    Club,
    PlayerStat,
    Fixture,
    sequelize
 } = models;

export const findById = async (id: number) => {
    return Player.findById(id, {
        include: [ Club ]
    })
}

export const findByOptaId = async (optaId: string) => {
    return Player.findOne({
        where: { optaId },
        include: [ Club ]
    })
}

export const findAll = async () => {
    return Player.findAll({
        limit: 500,
        include: [ Club ]
    })
}

export const findByName = async (name) => {
    return findBySearchField({ name })
}

export const findByPosition = async (position) => {
    return findBySearchField({ position })
}

export const findBySearchField = async (fields) => {
    const query = convertFieldsToSearchQuery(fields)
    return Player.findAll({
        where: query,
        include: [ Club ]
    })
}

const convertFieldsToSearchQuery = (fields) => {
    const query = {}
    Object.keys(fields).forEach(key => {
        query[key] = {
            [Op.iLike]: `%${fields[key]}%`
        }
    })
    return query
}

export const findStatsById = async (id: number, limit = 5) => {
    return PlayerStat.findAll({
        where: {
            playerId: id
        },
        include: [
            {
                model: Fixture,
                include: [
                    { model: Club, as: 'home' },
                    { model: Club, as: 'away' }
                ]
            }
        ],
        order: [[Fixture, 'gameDate', 'DESC']],
        limit
    })
}

export const upsertStat = async (optaId, optaFixtureId, stats, isHome, isStarter, transaction) => {
    let id
    if (typeof optaId === 'string') {
        const player: any = await findByOptaId(optaId)
        if (!player) {
            throw new Error(`optaId: ${optaId} not found`)
        }
        id = player.id
    }
    const fixture: any = await Fixture.findOne({
        where: { optaId: optaFixtureId }
    })
    const fixtureId = fixture.id
    return PlayerStat.upsert({
        fixtureId,
        playerId: id,
        isStarter,
        isHome,
        stats
    }, { transaction })
}
