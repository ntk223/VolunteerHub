import express from "express"
import { baseRoute } from "./baseRoute.js"

const Router = express.Router()

Router.use ('/base', baseRoute)

export const userRoute = Router

