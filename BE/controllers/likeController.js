import { likeService } from "../services/likeService.js";
import StatusCodes from "http-status-codes";
class LikeController {
    async createLike(req, res) {
        const { postId, userId } = req.body;
        const like = await likeService.createLike(postId, userId);
        if (like) {
            res.status(StatusCodes.CREATED).json(like);
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to create like" });
        }
    }
}

export const likeController = new LikeController();