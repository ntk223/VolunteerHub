import express from 'express'
import { verifyToken } from '../utils/jwt.js'
const Router = express.Router()

Router.use(verifyToken)

export const adminRoute = Router
