import {userRepo} from "../repositories/userRepo.js"
class AuthService {
    
    async login(email, password, role) {
        const result = await userRepo.login(email, password, role);
        return result;
    }
    async register(userData) {
        const user = await userRepo.register(userData);
        return user;
    }
}

export const authService = new AuthService();