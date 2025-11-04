import express from 'express'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { userController } from '../controllers/userController.js'
import { postController } from '../controllers/postController.js'
import { eventController } from '../controllers/eventController.js' 
import { applicationController } from '../controllers/applicationController.js' 
import { authorize } from '../middlewares/authorize.js'

const Router = express.Router()

// ✅ LỚP BẢO VỆ CHUNG (Token + Admin Role)
Router.use(verifyTokenMiddleware)
Router.use(authorize(['admin'])) 

// --- CÁC TUYẾN ĐƯỜNG ADMIN ---

// ADMIN DASHBOARD
Router.get('/dashboard-stats', (req, res) => res.status(200).json({ message: "Admin Dashboard Data" }))


// ===================================
// 1. QUẢN LÝ NGƯỜI DÙNG (User Management)
// ===================================

Router.route('/users')
    .get(userController.getAllUsersForAdmin) 
    .post(userController.createUserByAdmin) 

Router.route('/users/:id')
    .get(userController.getUserDetailForAdmin) 
    .put(userController.updateUserByAdmin) 
    .delete(userController.deleteUserByAdmin) 


// ===================================
// 2. QUẢN LÝ BÀI VIẾT (Post Management)
// ===================================

Router.route('/posts')
    .get(postController.getAllPostsForAdmin) 

Router.route('/posts/:id')
    .get(postController.getPostDetailForAdmin) 
    .put(postController.updatePostByAdmin) 
    .delete(postController.deletePostByAdmin) 


// ===================================
// 3. QUẢN LÝ SỰ KIỆN (Event Management)
// ===================================

Router.route('/events')
    .get(eventController.getAllEventsForAdmin)
    .post(eventController.createEventByAdmin) 

Router.route('/events/:id')
    .put(eventController.updateEventByAdmin)
    .delete(eventController.deleteEventByAdmin)


// ===================================
// 4. QUẢN LÝ ĐƠN ĐĂNG KÝ (Application Management)
// ===================================

Router.route('/applications')
    .get(applicationController.getAllApplicationsForAdmin) 

Router.route('/applications/:id')
    .patch(applicationController.updateApplicationStatus) 
    .delete(applicationController.deleteApplicationByAdmin)


export default Router