import {Like, User} from "../models/Model.js";

class LikeRepository {
    async createLike(postId, userId) {
        return await Like.create({ post_id: postId, user_id: userId });
    }
    async getLikesByPostId(postId) {
        const likes = await Like.findAll({ 
            where: { post_id: postId },
            include: [
                {   
                    model: User, 
                    attributes: ['name', 'role'],
                    as: 'user' 
                }
            ],
            attributes: ['createdAt']

        });
        return likes;
    }
}   

export const likeRepo = new LikeRepository();