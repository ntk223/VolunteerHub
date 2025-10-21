import { commentService } from "../services/commentService.js";
import { StatusCodes } from "http-status-codes";
class CommentController {
    async createComment(req, res) {
        const { postId, authorId, content } = req.body;
        const comment = await commentService.createComment(postId, authorId, content);
        if (comment) {
            res.status(StatusCodes.CREATED).json(comment);
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to create comment" });
        }
    }

    async getCommentsByPostId(req, res) {
        const { postId } = req.params;
        const comments = await commentService.getCommentsByPostId(postId);
        res.status(StatusCodes.OK).json(comments);
    }
}

export const commentController = new CommentController();
