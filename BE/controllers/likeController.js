import { likeService } from "../services/likeService.js";
import StatusCodes from "http-status-codes";
class LikeController {
    async createLike(req, res) {
        const { postId, userId } = req.body;
        const like = await likeService.createLike(postId, userId);
        //const { post_id, user_id } = req.body;
        // const like = await likeService.createLike(post_id, user_id);
        if (like) {
            res.status(StatusCodes.CREATED).json(like);
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to create like" });
        }
    }

    async getLikesByPostId(req, res) {
        const { postId } = req.params;
        const likes = await likeService.getLikesByPostId(postId);
        res.status(StatusCodes.OK).json(likes);
    }
}

export const likeController = new LikeController();