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
        const user = await userRepo.getUserById(userId);
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

    async updateStatus(id, status) {
        const updatedUser = await userRepo.updateStatus(id, status);
        return updatedUser;
    }

    async changeStatus(id, status) {
        const updatedUser = await userRepo.changeStatus(id, status);
        return updatedUser;
    }

    async getStatisticsForUser(id) {
        const statistics = await userRepo.getStatisticsForUser(id);
        return statistics;
    }
}

export const userService = new UserService();
