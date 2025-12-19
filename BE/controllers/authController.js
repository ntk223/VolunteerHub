import { authService } from "../services/authService.js";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/environment.js";

class AuthController {
    async login(req, res) {
        const { email, password, role } = req.body;
        const result = await authService.login(email, password, role);
        
        // Set cookie với token
        res.cookie('token', result.token, {
            httpOnly: true, // Không thể truy cập từ JavaScript (bảo mật hơn)
            secure: env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong production
            sameSite: 'lax', // Bảo vệ chống CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });
        
        res.status(StatusCodes.OK).json(result);
    }

    async logout(req, res) {
        // Xóa cookie khi logout
        res.clearCookie('token', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.status(StatusCodes.OK).json({ message: 'Đăng xuất thành công' });
    }

    async register(req, res) {
        const userData = req.body;
        const user = await authService.register(userData);
        res.status(StatusCodes.CREATED).json(user);
    }
}

export const authController = new AuthController();