import express from "express";
import { likeController } from "../controllers/likeController.js";

const Router = express.Router()

/**
 * @swagger
 * /api/like:
 *   post:
 *     tags:
 *       - Likes
 *     summary: Thêm lượt thích cho bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đã like bài viết
 */
Router.post('/', likeController.toggleLike)

/**
 * @swagger
 * /api/like:
 *   delete:
 *     tags:
 *       - Likes
 *     summary: Bỏ lượt thích
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã bỏ like
 */
Router.delete('/', likeController.removeLike)

/**
 * @swagger
 * /api/like/post/{postId}:
 *   get:
 *     tags:
 *       - Likes
 *     summary: Lấy danh sách lượt thích theo postId
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách likes
 */
Router.get('/post/:postId', likeController.getLikesByPostId)

Router.get('/user/:userId', likeController.getLikesByUserId)
export const likeRoute = Router;