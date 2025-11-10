import { postRepo } from "../repositories/postRepo.js"
import { getIO } from "../config/socket.js";

class PostService {
    async createPost(postData) {
        return await postRepo.createPost(postData);
    }

    async getAllPosts() {
        return await postRepo.getAllPosts();
    }

    async getPostByType(postType) {
        return await postRepo.getPostByType(postType);
    }

    async changePostStatus(postId, status) {
        const { post, notification } = await postRepo.changePostStatus(postId, status);
        // Gửi thông báo qua Socket.io
        const io = getIO();
        io.to(`user_${post.authorId}`).emit("newNotification", notification);
        return post;
    }

    async deletePost(postId) {
        return await postRepo.deletePost(postId);
    }
}


export const postService = new PostService()