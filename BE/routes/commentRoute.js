import express from "express";
import { commentController } from "../controllers/commentController.js";
import  validate from "../middlewares/validate.js";
import { commentValidator } from "../validators/commentValidator.js";
const Router = express.Router()


Router.post('/', validate(commentValidator.createComment), commentController.createComment)
Router.get('/post/:postId', commentController.getCommentsByPostId)
export const commentRoute = Router;