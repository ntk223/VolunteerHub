import User from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import { StatusCodes } from "http-status-codes"
import { hashPassword, comparePassword } from "../utils/password.js";
class UserRepository {

    async createUser(userData)  {
        const existingUser = await User.findOne({ 
            where: { 
                email: userData.email,
                role: userData.role
            } 
        })
        if (existingUser) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Email already in use");
        }
        userData.password = await hashPassword(userData.password);
        const user = await User.create(userData)
        return user
    }

    async getAllUsers() {
        const users = await User.findAll()
        return users
    }

    async getAllUserById(id) {
        const user = await User.findByPk(id)
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
        }
        return user
    }

    // async getUserByEmail(email) {
    //     const user = await User.findOne({ where: { email } })
    //     if (!user) {
    //         throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    //     }
    //     return user
    // }

}
export const userRepo = new UserRepository()