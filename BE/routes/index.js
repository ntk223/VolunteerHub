import express from "express"
import { adminRoute } from "./admin/index.js"
import { userRoute } from "./user/index.js"

const Router = express.Router()

Router.use('/admin', adminRoute)
Router.use('/user', userRoute)

export const APIs = Router