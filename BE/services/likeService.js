import {likeRepo} from "../repositories/likeRepo.js"

class LikeService {
    async createLike(postId, userId) {
        return await likeRepo.createLike(postId, userId);
    }
}

export const likeService = new LikeService();