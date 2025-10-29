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
Router.delete('/user/:userId/event/:eventId', authorize(['manager', 'admin']), eventController.deleteEvent) // Delete event by manager or admin
Router.put('/:id', authorize(['manager']), validate(eventValidator.updateEvent), eventController.updateEvent)
Router.patch('/approval-status/:id', authorize(['admin']), eventController.updateApprovalStatus)
Router.patch('/progress-status/:id', authorize(['manager']), eventController.updateEventProgressStatus)
export const eventRoute = Router

 