import models from '../models'
import { Op } from 'sequelize'
const {
    Player,
    Club,
} = models;

export const findById = async (id: number, withPlayers = false) => {
    if (withPlayers) {
        return Club.findById(id, {
            include: [ Player ]
        })
    }
    return Club.findById(id)
}

export const findByOptaId = async (optaId: string) => {
    return Player.findOne({
        where: { optaId }
    })
}

export const findAll = async (withPlayers = false) => {
    if (withPlayers) {
        return Club.findAll({
            include: [Player]
        })
    }
    return Club.findAll({
        limit: 500
    })
}

export const findByName = async (name: string) => {
    return findBySearchField({ name })
}

export const findBySearchField = async (fields) => {
    const query = convertFieldsToSearchQuery(fields)
    return Club.findAll({
        where: query
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