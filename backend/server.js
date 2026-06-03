import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import 'dotenv/config'
import main from './config/db.js'
import roomRoutes from './routes/roomRoutes.js'
import socketHandler from './socket/socketHandler.js'


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/rooms', roomRoutes)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

socketHandler(io)

const PORT = process.env.PORT || 4000

main()
.then(() => {
    server.listen(PORT, () => {
        console.log("Server running on port 4000")
    })
})
.catch((error) => {
    throw Error(error)
})