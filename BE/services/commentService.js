import {commentRepo} from '../repositories/commentRepo.js';
import { notificationRepo } from "../repositories/notificationRepo.js";
import { getIO } from "../config/socket.js";
class CommentService {
    async createComment(postId, authorId, content) {
        const {fullComment, userId} = await commentRepo.createComment(postId, authorId, content);
        const message = `${fullComment.author.name} đã bình luận về bài viết của bạn (ID: ${postId})`
        if (userId !== authorId) {
            const notification = await notificationRepo.createNotification({
                userId,
                message,
            })
            const io = getIO();
            io.to(`user_${userId}`).emit("newNotification", notification);
        }
        return fullComment
    }

    async getCommentsByPostId(postId) {
        return await commentRepo.getCommentsByPostId(postId);
    }

    async updateComment(commentId, content) {
        return await commentRepo.updateComment(commentId, content);
    }

    async deleteComment(commentId) {
        return await commentRepo.deleteComment(commentId);
    }
}

export const commentService = new CommentService();
