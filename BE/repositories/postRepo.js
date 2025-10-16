import { Post, User, Event, Like, Comment } from '../models/Model.js';
import sequelize from '../config/database.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from "http-status-codes";
class PostRepository {
    async createPost(postData) {
        const user = await User.findByPk(postData.author_id);
        if (!(user.role === 'manager' && postData.post_type === 'recruitment')) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Only managers can create recruitment posts');
        }
        return await Post.create(postData);
    }

    async getPostByType(postType) {

    const posts = await Post.findAll({
        attributes: [
            'id',
            'post_type',
            'content',
            [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id)'), 'likeCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments.post_id = Post.id)'), 'commentCount'],
        ],
        include: [
            { model: User, attributes: ['id', 'name'], as: 'author' },
            { model: Event, attributes: ['title'], as: 'event' },
        ],
        where: {
            status: 'approved',
            post_type: postType,
            deletedAt: null,
        },
        order: [['id', 'DESC']],
        });

        if (!posts) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Posts not found');
        }
        return posts;
    }
}
export const postRepo = new PostRepository();
