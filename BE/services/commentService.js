import {commentRepo} from '../repositories/commentRepo.js';

class CommentService {
    async createComment(postId, authorId, content) {
        return await commentRepo.createComment(postId, authorId, content);
    }

    async getCommentsByPostId(postId) {
        return await commentRepo.getCommentsByPostId(postId);
    }
}

export const commentService = new CommentService();
