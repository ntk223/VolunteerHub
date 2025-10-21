import {Like} from "../models/Model.js";

class LikeRepository {
    async createLike(postId, userId) {
        return await Like.create({ post_id: postId, user_id: userId });
    }
}   

export const likeRepo = new LikeRepository();