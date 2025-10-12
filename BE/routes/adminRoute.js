import express from 'express'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { userController } from '../controllers/userController.js'
import { authorize } from '../middlewares/authorize.js'
const Router = express.Router()

Router.use(verifyTokenMiddleware)


export const adminRoute = Router
