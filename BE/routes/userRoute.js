import express from 'express'
import { userController } from '../controllers/userController.js'
import validate from '../middlewares/validate.js'
import { userValidator } from '../validators/userValidator.js'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { authorize } from '../middlewares/authorize.js'

const Router = express.Router()
Router.use(verifyTokenMiddleware)

Router.put('/:id', validate(userValidator.updateUser), userController.updateUser)
Router.get('/profile/:id', userController.getUserById)
Router.put('/password/:id', validate(userValidator.changePassword), userController.changePassword)
Router.post('/', validate(userValidator.createUser), userController.createUser)

// route for admin only
Router.delete('/:id', authorize(['admin']), userController.deleteUser)
Router.get('/', authorize(['admin']), userController.getAllUsers)
Router.patch('/status/:id', authorize(['admin']), userController.changeStatus)
export const userRoute = Router

