import {Like, User} from "../models/Model.js";

class LikeRepository {
    async createLike(postId, userId) {
        const existingLike = await Like.findOne({ where: { postId, userId } });
        if (existingLike) {
            await Like.update({
                deletedAt: null
            }, {
                where: { id: existingLike.id }
            })
            return existingLike
        }
        return await Like.create({ postId, userId });
    }

    async removeLike(postId, userId) {
        const existingLike = await Like.findOne({ where: { postId, userId } });
        if (existingLike) {
            await Like.destroy({ where: { id: existingLike.id } });
            return existingLike;
        }
        return null;
    }

    async getLikesByPostId(postId) {
        const likes = await Like.findAll({ 
            where: { 
                postId,
            },
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