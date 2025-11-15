import express from "express";
import { commentController } from "../controllers/commentController.js";
import  validate from "../middlewares/validate.js";
import { commentValidator } from "../validators/commentValidator.js";
const Router = express.Router()


/**
 * @swagger
 * /api/comment:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Tạo bình luận cho bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               authorId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bình luận được tạo
 */
Router.post('/', validate(commentValidator.createComment), commentController.createComment)

/**
 * @swagger
 * /api/comment/post/{postId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Lấy danh sách bình luận theo postId
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bình luận
 */
Router.get('/post/:postId', commentController.getCommentsByPostId)

/**
 * @swagger
 * /api/comment/{commentId}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Cập nhật bình luận
 *     parameters:
 *       - in: path
 *         name: commentId
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bình luận đã được cập nhật
 */
Router.put('/:commentId', commentController.updateComment)

/**
 * @swagger
 * /api/comment/{commentId}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Xóa bình luận
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bình luận đã được xóa
 */
Router.delete('/:commentId', commentController.deleteComment)

export const commentRoute = Router;