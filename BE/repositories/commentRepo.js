import {Comment, User} from "../models/Model.js";

class CommentRepository {
    async createComment(postId, authorId, content) {
        console.log("Creating comment with:", { postId, authorId, content });
        return await Comment.create({ post_id: postId, author_id: authorId, content });
    }

    async getCommentsByPostId(postId) {
        return await Comment.findAll({ where: { post_id: postId },
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'name']
        }] });
    }
}

export const commentRepo = new CommentRepository();
