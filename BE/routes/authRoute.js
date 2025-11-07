import express from 'express'
import { authController } from '../controllers/authController.js'
import validate from '../middlewares/validate.js'
import { userValidator } from '../validators/userValidator.js'
const Router = express.Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trả về access token và thông tin user
 */
Router.post('/login', authController.login)

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               introduce:
 *                 type: string
 *     responses:
 *       201:
 *         description: Người dùng được tạo
 */
Router.post('/register', validate(userValidator.createUser), authController.register)

export const authRoute = Router
