import express from 'express'
import { eventController } from '../controllers/eventController.js'
import validate from '../middlewares/validate.js'
import { eventValidator } from '../validators/eventValidator.js'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { authorize } from '../middlewares/authorize.js'
const Router = express.Router()

Router.use(verifyTokenMiddleware)

Router.get('/', eventController.getAllEvents)
Router.post('/', authorize(['manager']),validate(eventValidator.createEvent), eventController.createEvent)
// Router.get('/:id', userController.getUserById)
// Router.delete
export const eventRoute = Router

