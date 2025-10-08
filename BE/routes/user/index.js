import express from "express"
import { baseRoute } from "./baseRoute.js"
import { authRoute } from "./authRoute.js"
const Router = express.Router()

Router.use ('/base', baseRoute)
Router.use ('/auth', authRoute)
export const userRoute = Router

