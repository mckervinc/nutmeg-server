import { db } from '../drivers'
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';
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
        const result = await db.query(USERS_TABLE, fields)
        if (!result.length) return null;

        return result[0]
    }

    async isEmailInUse(email) {
        const normalizedEmail = validator.normalizeEmail(email)
        const result = await db.query(USERS_TABLE, { email: normalizedEmail })

        return Boolean(result.length)
    }

    async createUser(user: User) {
        const emailInUse = await this.isEmailInUse(user.email)

        if (emailInUse) throw createError(400, 'User already exists');

        user.password = this.hashPassword(user.password)

        return db.insert(USERS_TABLE, user)
    }

    comparePassword(password, savedPassword) {
        return bcrypt.compareSync(password, savedPassword)
    }

    hashPassword(password, salt = SALT_ROUNDS) {
        return bcrypt.hashSync(password, salt)
    }
}

export default new UserService()