import { likeService } from "../services/likeService.js";
import StatusCodes from "http-status-codes";
class LikeController {
    async toggleLike(req, res) {
        const { postId, userId } = req.body;
        const like = await likeService.toggleLike(postId, userId);
        if (like) {
            res.status(StatusCodes.CREATED).json(like);
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to create like" });
        }
    }
    async removeLike(req, res) {
        const { postId, userId } = req.body;
        const like = await likeService.removeLike(postId, userId);
        if (like) {
            res.status(StatusCodes.OK).json({ like });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Like not found" });
        }
    }

    async getLikesByPostId(req, res) {
        const { postId } = req.params;
        const likes = await likeService.getLikesByPostId(postId);
        res.status(StatusCodes.OK).json(likes);
    }

    async getLikesByUserId(req, res) {
        const { userId } = req.params;
        const likes = await likeService.getLikesByUserId(userId);
        res.status(StatusCodes.OK).json(likes);
    }
}

export const likeController = new LikeController();