import express from "express"
import { adminRoute } from "./admin/index.js"

const Router = express.Router()

Router.use('/admin', adminRoute)


export const APIs = Router