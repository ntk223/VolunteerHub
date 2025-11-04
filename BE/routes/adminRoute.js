import express from 'express'
import verifyTokenMiddleware from '../middlewares/verifyToken.js'
import { userController } from '../controllers/userController.js'
import { postController } from '../controllers/postController.js'
import { authorize } from '../middlewares/authorize.js'

const Router = express.Router()

// ✅ LỚP BẢO VỆ 1: Kiểm tra Token
Router.use(verifyTokenMiddleware)

// ✅ LỚP BẢO VỆ 2: Kiểm tra Quyền Admin (áp dụng cho tất cả các routes bên dưới)
Router.use(authorize(['admin'])) 

// --- CÁC TUYẾN ĐƯỜNG ADMIN ---

// ADMIN DASHBOARD
Router.get(
    '/dashboard-stats',
    (req, res) => res.status(200).json({ message: "Admin Dashboard Data" })
)

// QUẢN LÝ NGƯỜI DÙNG (User Management)
Router.route('/users')
    // 💡 Tên hàm rõ ràng hơn
    .get(userController.getAllUsersForAdmin) 
    .post(userController.createUserByAdmin) 

Router.route('/users/:id')
    // 💡 Tên hàm rõ ràng hơn
    .get(userController.getUserDetailForAdmin) 
    .put(userController.updateUserByAdmin) 
    .delete(userController.deleteUserByAdmin) 

// QUẢN LÝ BÀI VIẾT (Post Management)
Router.route('/posts/:id')
    // Hàm này đã đặt tên đúng mục đích
    .delete(postController.deletePostByAdmin) 


// ✅ Cập nhật export (Nên dùng default export nếu router này là file chính)
export default Router 
