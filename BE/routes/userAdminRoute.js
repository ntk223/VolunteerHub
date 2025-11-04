// src/routes/api/admin/userAdminRoute.js
import express from 'express';
import { userController } from '../controllers/userController.js';

const userAdminRouter = express.Router();

// Tuyến đường quản lý người dùng (User Management)
userAdminRouter.route('/')
    .get(userController.getAllUsersForAdmin) // GET /admin/users
    .post(userController.createUserByAdmin); // POST /admin/users

userAdminRouter.route('/:id')
    .get(userController.getUserDetail)      // GET /admin/users/:id
    .put(userController.updateUserRole)     // PUT /admin/users/:id (Thay đổi vai trò)
    .delete(userController.deleteUser);   // DELETE /admin/users/:id

export default userAdminRouter;