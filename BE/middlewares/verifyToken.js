import { verifyToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "No token provided"));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "No token provided"));
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Lưu thông tin người dùng đã giải mã vào req.user để các middleware hoặc route handler sau có thể sử dụng
        next();
    } catch (error) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token"));
    }
};

export default verifyTokenMiddleware;