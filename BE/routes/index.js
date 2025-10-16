import express from "express"
import { adminRoute } from "./adminRoute.js"
import { userRoute } from "./userRoute.js"
import { authRoute } from "./authRoute.js"
import { eventRoute } from "./eventRoute.js"
import { postRoute } from "./postRoute.js"
const Router = express.Router()

Router.use('/admin', adminRoute)
Router.use('/user', userRoute)
Router.use('/auth', authRoute)
Router.use('/event', eventRoute)
Router.use('/post', postRoute)
export const APIs = Router