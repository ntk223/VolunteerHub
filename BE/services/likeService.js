import {likeRepo} from "../repositories/likeRepo.js"

class LikeService {
    async toggleLike(postId, userId) {
        return await likeRepo.toggleLike(postId, userId);
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