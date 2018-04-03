import { db } from '../drivers';
import bcrypt from 'bcrypt';
import UserService from './UserService';
import * as validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as createError from 'http-errors'
// this will be our class that contains all the handlers for passport strategies
class AuthService {
    async local(email, password, done) {
        if (!validator.isEmail(email)) {
            return done(createError(400, 'Not a valid email address'))
        }
        const emailInUse = await UserService.isEmailInUse(email)

        if (!emailInUse) {
            return done(createError(401, 'No user associated with that email'))
        }

        const user = await UserService.findOne({
            email
        })

        if (UserService.comparePassword(password, user.password)) {
            return done(null, user)
        } else {
            return done(createError(401, 'Incorrect password'))
        }
    }

    async jwt(token, done) {
        if (!token) {
            return done(createError(401))
        } else {
            return done(null, token)
        }
    }
}

export default new AuthService()