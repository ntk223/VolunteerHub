import express from "express";

import { authRoute } from "./authRoute.js";
import { userRoute } from "./userRoute.js";

import { postRoute } from "./postRoute.js";
import { eventRoute } from "./eventRoute.js";
import { applicationRoute } from "./applicationRoute.js";

import { commentRoute } from "./commentRoute.js";
import { likeRoute } from "./likeRoute.js";
import { fileRoute } from "./fileRoute.js";
import { notificationRoute } from "./notificationRoute.js";
import pushNotificationRoute from "./pushNotificationRoute.js";

const router = express.Router();

// 1. Routes xác thực & người dùng
router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/file', fileRoute)

// 2. Routes tài nguyên chính
router.use('/post', postRoute)
router.use('/event', eventRoute)
router.use('/application', applicationRoute)

// 3. Routes hành động phụ
router.use('/comment', commentRoute)
router.use('/like', likeRoute)
router.use('/notification', notificationRoute)
router.use('/push', pushNotificationRoute)

// 4. Admin
// router.use('/admin', adminRoute)

export const APIs = router;
