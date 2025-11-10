import express from 'express'
import { APIs } from './routes/index.js'
// import sequelize from './config/database.js'
import { env } from './config/environment.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import { corsOptions } from './config/cors.js'
import { swaggerDocs } from './config/swagger.js'
import cors from 'cors'

import { initSocket } from './config/socket.js'
import http from 'http'

const START_SERVER = () => {
    
    const app = express ()
    const server = http.createServer (app)
    // Khởi tạo Socket.io
    initSocket (server)

    // Thiết lập CORS và các middleware khác
    app.use (cors(corsOptions))
    app.use (express.json())
    app.use ('/api', APIs)

    // Xử lý lỗi tập trung trong ứng dụng
    app.use (errorHandlingMiddleware)
    // Tài liệu API với Swagger
    swaggerDocs (app)
    // Kết nối Database
    server.listen(env.APP_PORT, () => {
        console.log(`Server is running on port ${env.APP_PORT}`)
    })

}

START_SERVER ()