import {userRepo} from '../repositories/userRepo.js';

class UserService {

    async createUser(userData) {
        const user = await userRepo.createUser(userData);
        return user;
    }

    async getAllUsers() {
        const users = await userRepo.getAllUsers();
        return users;
    }
    async getUserById(userId) {
        const user = await userRepo.getAllUserById(userId);
        return user;
    }
}

export const userService = new UserService();
