import express from 'express'
import { userController } from '../../controllers/userController.js'
import validate from '../../middlewares/validate.js'
import { userValidator } from '../../validators/userValidator.js'
const Router = express.Router()

Router.get('/', userController.getAllUsers)
Router.post('/', validate(userValidator.createUser), userController.createUser)
Router.get('/:id', userController.getUserById)
export const userRoute = Router

