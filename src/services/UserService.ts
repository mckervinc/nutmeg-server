import { db } from '../drivers'
import * as bcrypt from 'bcrypt';
import * as assert from 'assert';
import * as createError from 'http-errors';

const USERS_TABLE = 'users'
const SALT_ROUNDS = 10;

interface User {
    username: string,
    password: string,
    email: string,
    first_name: string,
    last_name: string
}

class UserService {
    private table;
    constructor() {
        this.table = USERS_TABLE
    }

    async findOne(fields) {
        return await db.queryOne(this.table, fields)
    }

    async createUser(user: User) {
        // TODO MAKE SURE TO NORMALIZE THE EMAIL
        const emailInUse = await this.findOne({email: user.email})

        if (emailInUse) throw createError(400, 'User already exists');

        user.password = this.hashPassword(user.password)

        return db.insert(this.table, user)
    }

    comparePassword(password, savedPassword) {
        return bcrypt.compareSync(password, savedPassword)
    }

    hashPassword(password, salt = SALT_ROUNDS) {
        return bcrypt.hashSync(password, salt)
    }
}

export default new UserService()