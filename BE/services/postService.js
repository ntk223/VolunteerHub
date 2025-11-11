import { postRepo } from "../repositories/postRepo.js"
import { notificationRepo } from "../repositories/notificationRepo.js";
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
        const post = await postRepo.changePostStatus(postId, status);
        const statusVN = status === 'approved' ? 'được phê duyệt' : 'bị từ chối';
        // Tạo thông báo cho tác giả bài viết
        const notificationMessage = `Bài viết của bạn (ID: ${postId}) đã ${statusVN}.`;
        const notification = await notificationRepo.createNotification({userId: post.authorId, message: notificationMessage})
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