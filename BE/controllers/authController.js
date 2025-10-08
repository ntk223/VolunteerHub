import { authService } from "../services/authService.js";
import { StatusCodes } from "http-status-codes";
class AuthController {
    async login(req, res) {
        const { email, password, role } = req.body;
        const result = await authService.login(email, password, role);
        res.status(StatusCodes.OK).json(result);
    }

    async register(req, res) {
        const userData = req.body;
        const user = await authService.register(userData);
        res.status(StatusCodes.CREATED).json(user);
    }
}

export const authController = new AuthController();