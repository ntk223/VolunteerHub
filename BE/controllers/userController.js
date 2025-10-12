import { userService } from "../services/userService.js";
import { StatusCodes } from "http-status-codes";
class UserController {

    async createUser(req, res) {
        // const testuser = {
        //     "name": "Test User",
        //     "email": "testuser@example.com",
        //     "phone": "1234567890",
        //     "password_hash": "hashedpassword",
        //     "introduce": "Hello, I am a test user.",
        //     "role": "volunteer",
        //     "status": "active",
        // }
        const user = await userService.createUser(req.body);
        res.status(StatusCodes.CREATED).json(user);

    }

    async getAllUsers(req, res) {
        const users = await userService.getAllUsers();
        res.status(StatusCodes.OK).json(users);
    }

    async getUserById(req, res) {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        res.status(StatusCodes.OK).json(user);
    }

    async updateUser(req, res) {
        const id = req.params.id;
        const updateData = req.body;
        const updatedUser = await userService.updateUser(id, updateData);
        res.status(StatusCodes.OK).json(updatedUser);
    }

    async changePassword(req, res) {
        const id = req.params.id;
        const { oldPassword, newPassword } = req.body;
        const result = await userService.changePassword(id, oldPassword, newPassword);
        res.status(StatusCodes.OK).json({ message: "Password changed successfully" });
    }

    async deleteUser(req, res) {
        const id = req.params.id;
        const result = await userService.deleteUser(id);
        res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
    }

    async updateStatus(req, res) {
        const id = req.params.id;
        const { status } = req.body;
        const updatedUser = await userService.updateStatus(id, status);
        res.status(StatusCodes.OK).json(updatedUser);
    }

}

export const userController = new UserController();
