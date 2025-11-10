import express from "express"
// import { adminRoute } from "./adminRoute.js"
import { authRoute } from "./authRoute.js" // Thường đặt xác thực lên đầu
import { userRoute } from "./userRoute.js"

import { postRoute } from "./postRoute.js"
import { eventRoute } from "./eventRoute.js"
import { applicationRoute } from "./applicationRoute.js" // Liên quan đến event/post

import { commentRoute } from "./commentRoute.js"
import { likeRoute } from "./likeRoute.js"
import { fileRoute } from "./fileRoute.js"
import { notificationRoute } from "./notificationRoute.js"
const router = express.Router()

// 1. Routes XÁC THỰC & NGƯỜI DÙNG
router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/file', fileRoute)
// 2. Routes TÀI NGUYÊN CHÍNH
router.use('/post', postRoute)
router.use('/event', eventRoute)
router.use('/application', applicationRoute) 

// 3. Routes HÀNH ĐỘNG PHỤ
router.use('/comment', commentRoute)
router.use('/like', likeRoute)
router.use('/notification', notificationRoute)
// 4. Routes QUẢN TRỊ (Admin) 
// router.use('/admin', adminRoute)


export const APIs = router