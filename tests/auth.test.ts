import 'jest'
import * as dotenv from 'dotenv';
dotenv.config();

import AuthService from '../src/services/AuthService';

describe('authentication handlers work', () => {
    test('valid email/password', done => {
        AuthService.local('test@testymctestface.com', 'password', err => {
            expect(err).toBeNull()
            done()
        })
    })

    test('incorrect password', done => {
        AuthService.local('test@testymctestface.com', 'wrong', err => {
            expect(err.message).toBe('Incorrect password')
            done()
        })
    })

    test('unused email', done => {
        AuthService.local('neverusedemail@email.com', 'password', err => {
            expect(err.message).toBe('No user associated with that email')
            done()
        })
    })

    test('not an email', done => {
        AuthService.local('lalalala', 'password', err => {
            expect(err.message).toBe('Not a valid email address')
            done()
        })
    })

    test('valid token', done => {
        // the jwt token just expects a valid object parsed from the header token
        // next level auth should check if the token is valid
        const token = {
            first_name: 'testy',
            last_name: 'mctestface',
            username: 'testy',
            password: 'this could be anything',
            email: 'test@testymctestface.com'
        }
        AuthService.jwt(token, err => {
            expect(err).toBeNull()
            done()
        })
    })

    test('invalid token', done => {
        AuthService.jwt(null, err => {
            expect(err.status).toBe(401)
            done()
        })
    })
})