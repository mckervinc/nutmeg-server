import { db } from '../drivers'

const PLAYERS_TABLE = 'players'
const STATS_TABLE = 'player_stats'
const CLUBS_TABLE = 'clubs'
const FIXTURES_TABLE = 'fixtures'

class PlayerService {
    private players
    private stats
    private clubs
    private fixtures
    constructor() {
        this.players = PLAYERS_TABLE
        this.stats = STATS_TABLE
        this.clubs = CLUBS_TABLE
        this.fixtures = FIXTURES_TABLE
    }

    async getById(id: number) {
        return await db.queryOne(this.players, { id })
    }

    async getByOptaId(id: string) {
        return await db.queryOne(this.players, { opta_id: id })
    }

    async getTeamById(id: number) {
        return await db.queryOne(this.clubs, { id })
    }

    async getTeamByOptaId(id: string) {
        return await db.queryOne(this.clubs, { opta_id: id })
    }

    async getTeamByShortName(name: string) {
        return await db.queryOne(this.clubs, { short_name: name })
    }

    async getPlayerDetails(id: number) {
        return await db.knex.select({
            name: 'players.name',
            short_name : 'players.short_name',
            position: 'position',
            club: 'clubs.name',
            birth_date: 'birth_date',
            country: 'country',
            height: 'height',
            weight: 'weight'
        }).from(this.players).innerJoin(this.clubs, 'clubs.id', 'club_id').where({'players.id': id})
    }

    async getPlayerStats(id: number) {
        return await db.knex.from(this.stats).innerJoin(this.fixtures, 'fixture_id', 'fixtures.id').where({ player_id: id })
    }
}

export default new PlayerService()