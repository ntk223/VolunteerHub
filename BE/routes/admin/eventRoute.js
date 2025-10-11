import express from 'express'
import { eventController } from '../../controllers/eventController.js'
import validate from '../../middlewares/validate.js'
import { eventValidator } from '../../validators/eventValidator.js'
const Router = express.Router()

Router.get('/', eventController.getAllEvents)
Router.post('/', validate(eventValidator.createEvent), eventController.createEvent)
// Router.get('/:id', userController.getUserById)
// Router.delete
export const eventRoute = Router

