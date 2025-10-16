import express from 'express'
import { postController } from '../controllers/postController.js'
import { postValidator } from '../validators/postValidation.js'
import validate from '../middlewares/validate.js'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { authorize } from '../middlewares/authorize.js'
const Router = express.Router()
Router.use(verifyTokenMiddleware)
Router.post('/', validate(postValidator.createPost), postController.createPost)
Router.get("/:postType", postController.getPostByType)
Router.patch("/status/:postId", authorize(['admin']), postController.changePostStatus)
export const postRoute = Router