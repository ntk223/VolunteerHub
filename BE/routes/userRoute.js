import express from 'express'
import { userController } from '../controllers/userController.js'
import validate from '../middlewares/validate.js'
import { userValidator } from '../validators/userValidator.js'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { authorize } from '../middlewares/authorize.js'

const Router = express.Router()
Router.use(verifyTokenMiddleware)

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Cập nhật thông tin user
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
 *         description: User được cập nhật
 */
Router.put('/:id', validate(userValidator.updateUser), userController.updateUser)

/**
 * @swagger
 * /api/user/profile/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy hồ sơ người dùng theo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin user
 */
Router.get('/profile/:id', userController.getUserById)

/**
 * @swagger
 * /api/user/password/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Thay đổi mật khẩu của user
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
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mật khẩu đã được thay đổi
 */
Router.put('/password/:id', validate(userValidator.changePassword), userController.changePassword)

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Tạo người dùng mới
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
Router.post('/', validate(userValidator.createUser), userController.createUser)

// route for admin only
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Xóa user (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User đã bị xóa
 */
Router.delete('/:id', authorize(['admin']), userController.deleteUser)

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy danh sách tất cả user (admin)
 *     responses:
 *       200:
 *         description: Danh sách users
 */
Router.get('/', authorize(['admin']), userController.getAllUsers)

/**
 * @swagger
 * /api/user/status/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Thay đổi trạng thái người dùng (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           properties:
 *             status:
 *               type: string
 *               enum: [active, blocked]
 *     responses:
 *       200:
 *         description: Trạng thái user đã được cập nhật
 */
Router.patch('/status/:id', authorize(['admin']), userController.changeStatus)
export const userRoute = Router

