import express from "express";
import { applicationController } from "../controllers/applicationController.js";
const Router = express.Router()


/**
 * @swagger
 * /api/application:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Tạo đơn ứng tuyển/đăng ký cho event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đơn ứng tuyển đã được tạo
 */
Router.post('/', applicationController.createApplication)

/**
 * @swagger
 * /api/application/event/{eventId}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Lấy danh sách đơn theo eventId
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đơn ứng tuyển
 */
Router.get('/event/:eventId', applicationController.getApplicationsByEventId)

/**
 * @openapi
 * /api/application/{id}:
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Thay đổi trạng thái đơn ứng tuyển
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *     responses:
 *       200:
 *         description: Trạng thái đơn đã được cập nhật
 */
Router.patch('/:id', applicationController.changeApplicationStatus)

/**
 * @swagger
 * /api/application/{id}/cancel:
 *   patch:
 *     tags:
 *       - Applications
 *     summary: Hủy đơn ứng tuyển
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đơn đã được hủy
 */
Router.patch('/:id/cancel', applicationController.cancelApplication)

Router.get('/volunteer/:volunteerId', applicationController.getApplcationByVolunteerId);
export const applicationRoute = Router;