import { verifyToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const verifyTokenMiddleware = (req, res, next) => {
    // Ưu tiên lấy token từ cookie, nếu không có thì lấy từ header
    let token = req.cookies?.token;
    
    // Nếu không có token trong cookie, kiểm tra Authorization header
    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            token = authHeader.split(' ')[1];
        }
    }
    
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