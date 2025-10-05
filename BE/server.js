import express from 'express'
import { APIs } from './routes/index.js'
// import sequelize from './config/database.js'
import { env } from './config/environment.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'

const START_SERVER = () => {

    const app = express ()
    app.use (express.json())
    app.use ('/api', APIs)

    // Xử lý lỗi tập trung trong ứng dụng
    app.use (errorHandlingMiddleware)

    // Kết nối Database
    app.listen(env.APP_PORT, () => {
        console.log(`Server is running on port ${env.APP_PORT}`)
    })

}

START_SERVER ()