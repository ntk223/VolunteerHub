import { postRepo } from "../repositories/postRepo.js"


class PostService {
    async createPost(postData) {
        return await postRepo.createPost(postData);
    }
    async getPostByType(postType) {
        return await postRepo.getPostByType(postType);
    }

    async changePostStatus(postId, status) {
        return await postRepo.changePostStatus(postId, status);
    }

    async deletePost(postId) {
        return await postRepo.deletePost(postId);
    }
}


export const postService = new PostService()