import bcrypt from 'bcrypt';
import * as UserService from './user';
import * as validator from 'validator';
import * as createError from 'http-errors'

// this will be the file that contains all the handlers for passport strategies
export const local = async (email, password, done) => {
        if (!validator.isEmail(email)) {
            return done(createError(400, 'Not a valid email'))
        }

        const normalizedEmail = validator.normalizeEmail(email)
        const user: any = await UserService.findByEmail(normalizedEmail)

        if (!user) {
            return done(createError(400, 'No user associated with those credentials'))
        }

        if (UserService.comparePassword(password, user.get('password'))) {
            return done(null, user.get({ plain: true }))
        } else {
            return done(createError(401, 'Incorrect password'))
        }
    }

export const jwt = async (token, done) => {
    if (!token) {
        return done(createError(401))
    } else {
        return done(null, token)
    }
}
