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

    async deleteUser(id) {
        const result = await userRepo.deleteUser(id);
        return result;
    }

    async updateUser(id, updateData) {
        const updatedUser = await userRepo.updateUser(id, updateData);
        return updatedUser;
    }

    async changePassword(id, oldPassword, newPassword) {
        const result = await userRepo.changePassword(id, oldPassword, newPassword);
        return result;
    }
}

export const userService = new UserService();
