import express from "express";
import { likeController } from "../controllers/likeController.js";

const Router = express.Router()

Router.post('/', likeController.createLike)
Router.delete('/', likeController.removeLike)
Router.get('/post/:postId', likeController.getLikesByPostId)
export const likeRoute = Router;