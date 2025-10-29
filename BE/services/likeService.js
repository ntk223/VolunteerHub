import {likeRepo} from "../repositories/likeRepo.js"

class LikeService {
    async createLike(postId, userId) {
        return await likeRepo.createLike(postId, userId);
    }
    async removeLike(postId, userId) {
        return await likeRepo.removeLike(postId, userId);
    }
    async getLikesByPostId(postId) {
        return await likeRepo.getLikesByPostId(postId);
    }
}

export const likeService = new LikeService();