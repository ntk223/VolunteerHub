import express from "express";
import { commentController } from "../controllers/commentController.js";
const Router = express.Router()


Router.post('/', commentController.createComment)
Router.get('/post/:postId', commentController.getCommentsByPostId)
export const commentRoute = Router;