import express from 'express'
import { eventController } from '../controllers/eventController.js'
import validate from '../middlewares/validate.js'
import { eventValidator } from '../validators/eventValidator.js'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { authorize } from '../middlewares/authorize.js'
const Router = express.Router()

Router.use(verifyTokenMiddleware)

/**
 * @swagger
 * /api/event:
 *   get:
 *     tags:
 *       - Events
 *     summary: Lấy tất cả sự kiện
 *     responses:
 *       200:
 *         description: Danh sách sự kiện
 */
Router.get('/', eventController.getAllEvents)

/**
 * @swagger
 * /api/event:
 *   post:
 *     tags:
 *       - Events
 *     summary: Tạo sự kiện mới (manager)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *               managerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sự kiện được tạo
 */
Router.post('/', authorize(['manager']),validate(eventValidator.createEvent), eventController.createEvent)

/**
 * @swagger
 * /api/event/user/{userId}/event/{eventId}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Xóa sự kiện (manager hoặc admin)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sự kiện đã bị xóa
 */
Router.delete('/user/:userId/event/:eventId', authorize(['manager', 'admin']), eventController.deleteEvent) // Delete event by manager or admin

/**
 * @swagger
 * /api/event/{id}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Cập nhật sự kiện (manager)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sự kiện đã được cập nhật
 */
Router.put('/:id', authorize(['manager']), validate(eventValidator.updateEvent), eventController.updateEvent)

/**
 * @swagger
 * /api/event/approval-status/{id}:
 *   patch:
 *     tags:
 *       - Events
 *     summary: Cập nhật trạng thái phê duyệt (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approvalStatus:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Trạng thái phê duyệt đã được cập nhật
 */
Router.patch('/approval-status/:id', authorize(['admin']), eventController.updateApprovalStatus)

/**
 * @swagger
 * /api/event/progress-status/{id}:
 *   patch:
 *     tags:
 *       - Events
 *     summary: Cập nhật trạng thái tiến độ sự kiện (manager)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             progressStatus:
 *               type: string
 *               enum: [incomplete, completed, cancelled]
 *     responses:
 *       200:
 *         description: Trạng thái tiến độ đã được cập nhật
 */
Router.patch('/progress-status/:id', authorize(['manager']), eventController.updateEventProgressStatus)
export const eventRoute = Router

 