import express from "express";
import { likeController } from "../controllers/likeController.js";

const Router = express.Router()

Router.post('/', likeController.createLike)

export const likeRoute = Router;