import {likeRepo} from "../repositories/likeRepo.js"
import { notificationRepo } from "../repositories/notificationRepo.js";
import { getIO } from "../config/socket.js";

class LikeService {
    async toggleLike(postId, userId) {
        const {like, isLiked, authorId, userLike} = await likeRepo.toggleLike(postId, userId);
        if (userId != authorId) {
            const message = isLiked ? "đã thích" : "đã bỏ thích";
            const notification = await notificationRepo.createNotification({
                userId: authorId,
                message: `${userLike} ${message} bài viết của bạn (ID: ${postId})`
        });
            const io = getIO();
            io.to(`user_${authorId}`).emit("newNotification", notification);
        }

        return {like, isLiked};
    }
    async removeLike(postId, userId) {
        return await likeRepo.removeLike(postId, userId);
    }
    async getLikesByPostId(postId) {
        return await likeRepo.getLikesByPostId(postId);
    }
    async getLikesByUserId(userId) {
        return await likeRepo.getLikesByUserId(userId);
    }
}

export const likeService = new LikeService();