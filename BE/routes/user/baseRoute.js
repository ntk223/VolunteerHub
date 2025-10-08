import express from 'express'
import { userController } from '../../controllers/userController.js'
import validate from '../../middlewares/validate.js'
import { userValidator } from '../../validators/userValidator.js'
const Router = express.Router()

Router.post('/update-profile', validate(userValidator.createUser), userController.createUser)
Router.get('/profile/:id', userController.getUserById)

export const baseRoute = Router

