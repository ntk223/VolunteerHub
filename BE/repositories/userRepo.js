import User from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import { StatusCodes } from "http-status-codes"
class UserRepository {

    async createUser(userData)  {
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

}
export const userRepo = new UserRepository()