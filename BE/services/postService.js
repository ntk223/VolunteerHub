import { postRepo } from "../repositories/postRepo.js"


class PostService {
    async createPost(postData) {
        return await postRepo.createPost(postData);
    }
    async getPostByType(postType) {
        return await postRepo.getPostByType(postType);
    }
}


export const postService = new PostService()