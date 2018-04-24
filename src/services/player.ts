import {
    Player,
    Club,
    PlayerStat,
    Fixture
 } from '../models'

export const findById = async (id: number) => {
    return Player.findById(id, {
        include: [ Club ]
    })
}

export const findByOptaId = async (optaId: string) => {
    return Player.findOne({
        where: { optaId }
    })
}

export const findStatsById = async (id: number) => {
    return PlayerStat.findById(id)
    // return PlayerStat.findAll({
    //     where: { playerId: id },
    //     include: [ Fixture ]
    // })
}