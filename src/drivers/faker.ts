import {
    Response
 } from '../framework'

export const notYetImplemented = (): Response => {
     return {
         message: 'Not yet implemented 😅',
         status: 418
     }
}

export default {
    notYetImplemented
}