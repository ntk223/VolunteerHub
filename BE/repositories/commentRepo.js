import {Comment, User} from "../models/Model.js";

class CommentRepository {
    async createComment(postId, authorId, content) {
    console.log("Creating comment with:", { postId, authorId, content });

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

    return fullComment;
    }


    async getCommentsByPostId(postId) {
        return await Comment.findAll({ where: { postId },
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatarUrl'],
        }] });
    }
}

export const commentRepo = new CommentRepository();
