import express from "express"
import { adminRoute } from "./adminRoute.js"
import { userRoute } from "./userRoute.js"
import { authRoute } from "./authRoute.js"
import { eventRoute } from "./eventRoute.js"
const Router = express.Router()

Router.use('/admin', adminRoute)
Router.use('/user', userRoute)
Router.use('/auth', authRoute)
Router.use('/event', eventRoute)

export const APIs = Router