import express from 'express'
import { authController } from '../../controllers/authController.js'
import validate from '../../middlewares/validate.js'
import { userValidator } from '../../validators/userValidator.js'
const Router = express.Router()


Router.post('/login', authController.login)
Router.post('/register', validate(userValidator.createUser), authController.register)
export const authRoute = Router
