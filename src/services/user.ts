import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
import * as createError from 'http-errors';

import models from '../models'

const { User } = models;

const SALT_ROUNDS = 10;

export const findByUsername = async (username) => {
    return User.findOne({
        where: { username }
    })
}

export const findByEmail = async (email) => {
    return User.findOne({
        where: { email }
    })
}
// STUB in production make this friends
export const listFriends = () => {
    return []
}

export const createUser = async (user) => {
    user.email = validator.normalizeEmail(user.email)
    user.username = user.username.toLowerCase()
    user.password = this.hashPassword(user.password)

    try {
        return await User.create(user)
    } catch (error) {
        throw createError(400, error.errors[0])
    }
}

export const comparePassword = (password, savedPassword) => {
    return bcrypt.compareSync(password, savedPassword)
}

export const hashPassword = (password, salt = SALT_ROUNDS) => {
    return bcrypt.hashSync(password, salt)
}
