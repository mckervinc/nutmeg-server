import { 
    Player,
    Club
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
