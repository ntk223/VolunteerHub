import express from 'express';
import { postController } from '../controllers/postController.js';
const Router = express.Router();

Router.post('/', postController.createPost);
Router.get("/:postType", postController.getPostByType);
export const postRoute = Router