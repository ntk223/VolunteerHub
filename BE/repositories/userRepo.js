import {User, Post, Like, Comment} from "../models/Model.js"
import ApiError from "../utils/ApiError.js"
import { StatusCodes } from "http-status-codes"
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { Op, fn, col, literal } from "sequelize";

import connection from "../config/databaseUsingSQL.js";
class UserRepository {

    async createUser(userData)  {
        console.log(userData);
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

    async getUserById(id) {
        const user = await User.findByPk(id)
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
        }
        if (user.role === 'volunteer') {
            return await User.findByPk(id, { include: 'volunteer' });
        }
        else if (user.role === 'manager') {
            return await User.findByPk(id, { include: 'manager' });
        }
        return user;
    }

    async updateUser(id, updateData) {
        const updatedUser = await User.update(updateData, {
            where: {id: id},
        })
        if (updatedUser[0] === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found or no changes made")
        }
        return await User.findByPk(id);
    }

    async changePassword(id, oldPassword, newPassword) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
        }
        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Old password is incorrect");
        }
        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;
        const result = await User.update({ password: hashedNewPassword }, { where: { id: id } });

        if (result[0] === 0) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to change password");
        }
        return true;
    }

    async updateStatus(id, status) {
        const updatedUser = await User.update({ status: status }, {
            where: {id: id},
        })
        if (updatedUser[0] === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found or no changes made")
        }
        return await User.findByPk(id);
    }
    async deleteUser(id) {
        const result = await User.destroy({
            where: {id: id},
        })
        if (result === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
        }
        return true
    }

    async changeStatus(id, status) {
        const updatedUser = await User.update({ status: status }, {
            where: {id: id},
        })
        if (updatedUser[0] === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found or no changes made")
        }
        return await User.findByPk(id);
    }
    async login(email, password, role)  {
        if (role === 'admin') {
            const user = await User.findOne({ where: { email, role } });
            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
            }
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid credentials");
            }
            const token = generateToken({id: user.id, email: user.email, role: user.role});
            return { user, token };
        }

        const user = await User.findOne({ 
            where: { 
                email: email,
                role: role
            },
            include: role 
        })

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid credentials");
        }
        if (user.status === 'blocked') {
            throw new ApiError(StatusCodes.FORBIDDEN, "User is blocked");
        }
        const token = generateToken({id: user.id, email: user.email, role: user.role});
        return { user, token };
    }

    async register(userData) {
        return this.createUser(userData);
    }

    async getStatisticsForUser(id) {
        const sql = `SELECT 
        u.id,
        u.name,
        COUNT(DISTINCT p.id) AS totalPosts,
        COUNT(DISTINCT l1.id) AS totalLikes,
        COUNT(DISTINCT c1.id) AS totalComments,
        COUNT(DISTINCT l2.id) + COUNT(DISTINCT c2.id) AS totalInteractions
        FROM users u
        LEFT JOIN posts p ON p.author_id = u.id AND p.status != 'rejected'
        LEFT JOIN likes l1 ON l1.post_id = p.id AND l1.deleted_at IS NULL
        LEFT JOIN comments c1 ON c1.post_id = p.id
        LEFT JOIN likes l2 ON l2.user_id = u.id AND l2.deleted_at IS NULL
        LEFT JOIN comments c2 ON c2.author_id = u.id
        where u.id = ${id}
        GROUP BY u.id, u.name
        ORDER BY totalInteractions DESC;`

        const [rows] = await connection.execute(sql);
        // await connection.end();

        return rows;
    }
}
export const userRepo = new UserRepository()