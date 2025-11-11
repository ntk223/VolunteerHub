import {Like, Post,User} from "../models/Model.js";

class LikeRepository {
    async toggleLike(postId, userId) {
        const post = await Post.findByPk(postId);
        const userLike =  await User.findByPk(userId);
        let existingLike = await Like.findOne({
            where: { postId, userId },
            paranoid: false,
        })
        if (existingLike) {
            existingLike = existingLike.dataValues;
            if (existingLike.deletedAt === null) {
            // Đang like → bấm nữa thì unlike (xóa mềm)
            await Like.destroy({ where: { id: existingLike.id } });
            const deletedLike = await Like.findByPk(existingLike.id, { paranoid: false });
            return { like: deletedLike, isLiked: false, authorId: post.authorId, userLike: userLike.name};
            } else {
            // Đã unlike → bấm nữa thì khôi phục like
            await Like.restore({ where: { id: existingLike.id } });
            const restoredLike = await Like.findByPk(existingLike.id);
            return { like: restoredLike, isLiked: true, authorId: post.authorId, userLike: userLike.name};
            }
        }

        // Chưa có like → tạo mới
        const newLike = await Like.create({ postId, userId });
        return { like: newLike, isLiked: true, authorId: post.authorId, userLike: userLike.name };
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
                    attributes: ['id','name', 'role', 'avatarUrl'],
                    as: 'user' 
                }
            ],
            attributes: ['createdAt']

        });
        return likes;
    }

    async getLikesByUserId(userId) {
        const likes = await Like.findAll({ 
            where: { 
                userId,
            },
        });
        return likes;
    }



}   

export const likeRepo = new LikeRepository();