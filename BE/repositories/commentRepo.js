import {Comment, User, Post} from "../models/Model.js";

class CommentRepository {
    async createComment(postId, authorId, content) {
    console.log("Creating comment with:", { postId, authorId, content });
    const post = await Post.findByPk(postId);
    if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
    }
    const comment = await Comment.create({ postId, authorId, content });
    
    // Lấy lại comment cùng thông tin người dùng
    const fullComment = await Comment.findOne({
        where: { id: comment.id },
        include: [
        {
            model: User,
            attributes: ['name', "role", "avatarUrl"],
            as: 'author',
        },
        ],
    });

    return {fullComment, userId : post.authorId};
    }


    async getCommentsByPostId(postId) {
        return await Comment.findAll({ where: { postId },
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatarUrl'],
        }] });
    }

    async updateComment(commentId, content) {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            throw new Error(`Comment with ID ${commentId} not found`);
        }
        
        await comment.update({ content });
        
        // Lấy lại comment đã cập nhật cùng thông tin người dùng
        const updatedComment = await Comment.findOne({
            where: { id: commentId },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatarUrl'],
            }],
        });

        return updatedComment;
    }

    async deleteComment(commentId) {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            throw new Error(`Comment with ID ${commentId} not found`);
        }
        
        await comment.destroy();
        return { success: true, message: 'Comment deleted successfully' };
    }
}

export const commentRepo = new CommentRepository();
