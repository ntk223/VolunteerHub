import { Post, User, Event, Notification } from '../models/Model.js';
import sequelize from '../config/database.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from "http-status-codes";
class PostRepository {
    async createPost(postData) {
        const user = await User.findByPk(postData.authorId);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }
        if (postData.postType === 'recruitment' && user.role !== 'manager') {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Only managers can create recruitment posts');
        }
        return await Post.create(postData);
    }
    async getAllPosts() {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'postType',
                'content',
                'status',
                [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id and likes.deleted_at IS NULL)'), 'likeCount'],
                [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments.post_id = Post.id and comments.deleted_at IS NULL)'), 'commentCount'],
            ],
            include: [
                { model: User, attributes: ['id', 'name', 'avatarUrl'], as: 'author' },
                { model: Event, attributes: ['title'], as: 'event' },
            ],
            order: [['id', 'DESC']],
        });
        if (!posts) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Posts not found');
        }
        return posts;
    }
    async getPostByType(postType) {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'postType',
                'content',
                [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id and likes.deleted_at IS NULL)'), 'likeCount'],
                [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments.post_id = Post.id and comments.deleted_at IS NULL)'), 'commentCount'],
            ],
            include: [
                { model: User, attributes: ['id', 'name', 'avatarUrl'], as: 'author' },
                { model: Event, attributes: ['title'], as: 'event' },
            ],
            where: {
                status: 'approved',
                postType,
            },
            order: [['id', 'DESC']],
            });

            if (!posts) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Posts not found');
            }
            return posts;
    }

    async changePostStatus(postId, status) {
        const post = await Post.findByPk(postId);
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
        }
        post.status = status;
        await post.save();
        const statusVN = status === 'approved' ? 'được phê duyệt' : 'bị từ chối';
        // Tạo thông báo cho tác giả bài viết
        const notificationMessage = `Bài viết của bạn (ID: ${postId}) đã ${statusVN}.`;
        const notification = await Notification.create({
            userId: post.authorId,
            message: notificationMessage,
        });

        return {post, notification};
    }

    async deletePost(postId) {
        const post = await Post.findByPk(postId);
        if (!post) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found');
        }
        await post.destroy();
        return post;
    }
}
export const postRepo = new PostRepository();
