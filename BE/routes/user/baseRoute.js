import express from 'express'
import { userController } from '../../controllers/userController.js'
import validate from '../../middlewares/validate.js'
import { userValidator } from '../../validators/userValidator.js'
const Router = express.Router()

Router.put('/update-profile/:id', validate(userValidator.updateUser), userController.updateUser)
Router.get('/profile/:id', userController.getUserById)
Router.put('/password/:id', validate(userValidator.changePassword), userController.changePassword)
export const baseRoute = Router

