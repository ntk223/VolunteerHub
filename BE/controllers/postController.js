import { postService } from "../services/postService.js";
import { StatusCodes } from "http-status-codes";
class PostController {
    async createPost(req, res) {
        const postData = req.body;
        const newPost = await postService.createPost(postData);
        res.status(StatusCodes.CREATED).json(newPost);
    }

    async getPostByType(req, res) {
        const postType = req.params.postType;
        const posts = await postService.getPostByType(postType);
        res.status(StatusCodes.OK).json(posts);
    }

    async changePostStatus(req, res) {
        const postId = req.params.id;
        const { status } = req.body;
        const updatedPost = await postService.changePostStatus(postId, status);
        res.status(StatusCodes.OK).json(updatedPost);
    }
}

export const postController = new PostController()