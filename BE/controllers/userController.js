import { userService } from "../services/userService.js";

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
        res.status(201).json(user);

    }

    async getAllUsers(req, res) {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    }

    async getUserById(req, res) {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    }

}

export const userController = new UserController();
