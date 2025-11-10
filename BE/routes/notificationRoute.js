import { notificationController } from "../controllers/notificationController.js";
import express from "express";

const router = express.Router();

// Lấy tất cả thông báo của người dùng theo userId
router.get("/user/:userId", notificationController.getNotificationsByUserId);
router.put("/read/:userId", notificationController.markNotificationAsRead);
export const notificationRoute = router;