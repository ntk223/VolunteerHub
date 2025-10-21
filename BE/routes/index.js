import express from "express"
import { adminRoute } from "./adminRoute.js"
import { userRoute } from "./userRoute.js"
import { authRoute } from "./authRoute.js"
import { eventRoute } from "./eventRoute.js"
import { postRoute } from "./postRoute.js"
import { applicationRoute } from "./applicationRoute.js"
import { commentRoute } from "./commentRoute.js"    
import { likeRoute } from "./likeRoute.js"
const Router = express.Router()

Router.use('/admin', adminRoute)
Router.use('/user', userRoute)
Router.use('/auth', authRoute)
Router.use('/application', applicationRoute)
Router.use('/event', eventRoute)
Router.use('/post', postRoute)
Router.use('/comment', commentRoute)
Router.use('/like', likeRoute)
export const APIs = Router