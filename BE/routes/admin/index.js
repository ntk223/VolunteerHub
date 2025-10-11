import express from "express"
import { userRoute } from "./userRoute.js"
import { eventRoute } from "./eventRoute.js"
const Router = express.Router()

Router.use ('/user', userRoute)
Router.use ('/event', eventRoute)

export const adminRoute = Router

