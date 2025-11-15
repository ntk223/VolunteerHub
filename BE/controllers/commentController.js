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
        const postId = req.params.postId;
        const comments = await commentService.getCommentsByPostId(postId);
        res.status(StatusCodes.OK).json(comments);
    }

    async updateComment(req, res) {
        const { commentId } = req.params;
        const { content } = req.body;
        
        try {
            const updatedComment = await commentService.updateComment(commentId, content);
            res.status(StatusCodes.OK).json(updatedComment);
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }

    async deleteComment(req, res) {
        const { commentId } = req.params;
        
        try {
            const result = await commentService.deleteComment(commentId);
            res.status(StatusCodes.OK).json(result);
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
}

export const commentController = new CommentController();
