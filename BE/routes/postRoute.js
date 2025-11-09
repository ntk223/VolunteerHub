import express from 'express'
import { postController } from '../controllers/postController.js'
import { postValidator } from '../validators/postValidator.js'
import validate from '../middlewares/validate.js'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { authorize } from '../middlewares/authorize.js'
const Router = express.Router()
Router.use(verifyTokenMiddleware)
Router.get('/', postController.getAllPosts)
/**
 * @swagger
 * /api/post:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Tạo bài viết mới
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
 *               postType:
 *                 type: string
 *               content:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               eventId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Bài viết được tạo
 */
Router.post('/', validate(postValidator.createPost), postController.createPost)

/**
 * @swagger
 * /api/post/{postType}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Lấy các bài viết theo loại
 *     parameters:
 *       - in: path
 *         name: postType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 */
Router.get("/:postType", postController.getPostByType)

// route for admin only
/**
 * @swagger
 * /api/post/status/{id}:
 *   patch:
 *     tags:
 *       - Posts
 *     summary: Thay đổi trạng thái bài viết (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trạng thái bài viết đã được cập nhật
 */
Router.patch("/status/:id", authorize(['admin']), postController.changePostStatus)

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Xóa bài viết (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bài viết đã bị xóa
 */
Router.delete("/:id", authorize(['admin']), postController.deletePost)
export const postRoute = Router