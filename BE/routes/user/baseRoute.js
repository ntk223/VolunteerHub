import express from 'express'
import { userController } from '../../controllers/userController.js'
import validate from '../../middlewares/validate.js'
import { userValidator } from '../../validators/userValidator.js'
import verifyTokenMiddleware from '../../middlewares/verifyToken.js'

const Router = express.Router()
Router.use(verifyTokenMiddleware)
Router.put('/update-profile/:id', validate(userValidator.updateUser), userController.updateUser)
Router.get('/profile/:id', userController.getUserById)
Router.put('/password/:id', validate(userValidator.changePassword), userController.changePassword)
Router.delete('/delete/:id', userController.deleteUser)
export const baseRoute = Router

