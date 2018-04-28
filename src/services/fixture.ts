import models from '../models'
import { Op } from 'sequelize'
const {
    Player,
    Club,
    PlayerStat,
    Fixture,
} = models;

export const findById = async (id: number) => {
    return Fixture.findById(id, {
        include: [
            { model: Club, as: 'home' },
            { model: Club, as: 'away' },
        ]
    })
}

export const findByOptaId = async (optaId: string) => {
    return Fixture.findOne({
        where: { optaId },
        include: [
            { model: Club, as: 'home' },
            { model: Club, as: 'away' },
        ]
    })
}

export const findAll = async () => {
    return Fixture.findAll({
        limit: 500,
        order: [['gameDate', 'DESC']],
        include: [ 
            { model: Club, as: 'home' },
            { model: Club, as: 'away' },
        ]
    })
}