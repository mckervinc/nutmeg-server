import * as dotenv from 'dotenv'
dotenv.config()
import app from './App';

const port = process.env.PORT || 3000;

const server = app.listen(port, (err) => {
    if (err) {
        return console.log(err)
    }
    return console.log(`We're live on ${port}!`)
})

export default server;