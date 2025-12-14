/**
 * =======================================================================
 * VOLUNTEERHUB API DOCUMENTATION - SWAGGER/OPENAPI 3.0
 * =======================================================================
 * 
 * File này chứa tất cả định nghĩa Swagger cho toàn bộ API endpoints.
 * Copy các phần @swagger vào các file route tương ứng.
 * 
 * Hướng dẫn sử dụng:
 * 1. Copy phần @swagger của từng endpoint vào file route tương ứng
 * 2. Đảm bảo giữ nguyên format và indentation
 * 3. Restart server để xem thay đổi tại http://localhost:5000/api-docs
 * 
 * =======================================================================
 */

// =====================================================================
// 📋 COMPONENTS - SCHEMAS ĐỊNH NGHĨA CHUNG
// =====================================================================

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT Authorization header sử dụng Bearer scheme. Nhập JWT token vào đây.
 * 
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Nguyễn Văn A
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         phone:
 *           type: string
 *           example: "0123456789"
 *         role:
 *           type: string
 *           enum: [volunteer, manager, admin]
 *           example: volunteer
 *         status:
 *           type: string
 *           enum: [active, blocked]
 *           example: active
 *         avatarUrl:
 *           type: string
 *           example: https://res.cloudinary.com/...
 *         introduce:
 *           type: string
 *           example: Tôi là một tình nguyện viên nhiệt huyết
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Chiến dịch dọn rác biển
 *         description:
 *           type: string
 *           example: Cùng nhau làm sạch bãi biển
 *         location:
 *           type: string
 *           example: Bãi biển Mỹ Khê, Đà Nẵng
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-15T08:00:00Z
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-15T12:00:00Z
 *         capacity:
 *           type: integer
 *           example: 50
 *         categoryId:
 *           type: integer
 *           example: 1
 *         managerId:
 *           type: integer
 *           example: 5
 *         approvalStatus:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: approved
 *         progressStatus:
 *           type: string
 *           enum: [incomplete, cancelled, completed]
 *           example: incomplete
 *         imgUrl:
 *           type: string
 *           example: https://res.cloudinary.com/...
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         authorId:
 *           type: integer
 *           example: 10
 *         postType:
 *           type: string
 *           enum: [discuss, recruitment]
 *           example: discuss
 *         content:
 *           type: string
 *           example: Hôm nay mình đã tham gia hoạt động rất ý nghĩa
 *         eventId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: approved
 *         likeCount:
 *           type: integer
 *           example: 25
 *         commentCount:
 *           type: integer
 *           example: 10
 *         media:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://res.cloudinary.com/image1.jpg"]
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         postId:
 *           type: integer
 *           example: 5
 *         authorId:
 *           type: integer
 *           example: 10
 *         content:
 *           type: string
 *           example: Bài viết hay quá!
 *         createdAt:
 *           type: string
 *           format: date-time
 *         author:
 *           $ref: '#/components/schemas/User'
 * 
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         eventId:
 *           type: integer
 *           example: 5
 *         volunteerId:
 *           type: integer
 *           example: 10
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, cancelled]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             statusCode:
 *               type: integer
 *               example: 400
 *             message:
 *               type: string
 *               example: Invalid request
 *             timestamp:
 *               type: string
 *               format: date-time
 *             path:
 *               type: string
 *               example: /api/posts
 */

// =====================================================================
// 👤 USER ROUTES - /api/user
// =====================================================================

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - 👤 Users
 *     summary: Lấy danh sách tất cả người dùng
 *     description: Admin có thể lấy danh sách tất cả users trong hệ thống
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [volunteer, manager, admin]
 *         description: Lọc theo vai trò
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, blocked]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/user/profile/{id}:
 *   get:
 *     tags:
 *       - 👤 Users
 *     summary: Xem hồ sơ người dùng theo ID
 *     description: Lấy thông tin chi tiết profile của một user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *         example: 1
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - 👤 Users
 *     summary: Cập nhật thông tin người dùng
 *     description: User có thể cập nhật thông tin cá nhân của mình
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               avatarUrl:
 *                 type: string
 *                 example: https://res.cloudinary.com/avatar.jpg
 *               introduce:
 *                 type: string
 *                 example: Giới thiệu mới
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 */

/**
 * @swagger
 * /api/user/{id}/status:
 *   patch:
 *     tags:
 *       - 👤 Users
 *     summary: Thay đổi trạng thái người dùng (Admin only)
 *     description: Admin có thể khóa/mở khóa tài khoản người dùng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, blocked]
 *                 example: blocked
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       403:
 *         description: Không có quyền thực hiện
 */

// =====================================================================
// 📝 POST ROUTES - /api/post
// =====================================================================

/**
 * @swagger
 * /api/post:
 *   get:
 *     tags:
 *       - 📝 Posts
 *     summary: Lấy tất cả bài viết
 *     description: Lấy danh sách tất cả bài viết đã được approved
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   post:
 *     tags:
 *       - 📝 Posts
 *     summary: Tạo bài viết mới
 *     description: Người dùng có thể tạo bài viết thảo luận hoặc tuyển tình nguyện viên
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postType
 *               - content
 *               - authorId
 *             properties:
 *               postType:
 *                 type: string
 *                 enum: [discuss, recruitment]
 *                 description: Loại bài viết
 *                 example: discuss
 *               content:
 *                 type: string
 *                 minLength: 5
 *                 description: Nội dung bài viết (tối thiểu 5 ký tự)
 *                 example: Hôm nay mình đã tham gia một hoạt động rất ý nghĩa...
 *               authorId:
 *                 type: integer
 *                 description: ID của tác giả
 *                 example: 10
 *               eventId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID của sự kiện (nếu có)
 *                 example: 5
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: Mảng URLs của media (hình ảnh/video)
 *                 example: ["https://res.cloudinary.com/image1.jpg"]
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /api/post/{postType}:
 *   get:
 *     tags:
 *       - 📝 Posts
 *     summary: Lấy bài viết theo loại
 *     description: Lấy danh sách bài viết theo loại (discuss hoặc recruitment)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [discuss, recruitment]
 *         description: Loại bài viết cần lấy
 *         example: discuss
 *     responses:
 *       200:
 *         description: Danh sách bài viết theo loại
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     tags:
 *       - 📝 Posts
 *     summary: Cập nhật nội dung bài viết
 *     description: Tác giả có thể chỉnh sửa nội dung bài viết của mình
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Nội dung bài viết đã được chỉnh sửa
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     tags:
 *       - 📝 Posts
 *     summary: Xóa bài viết (Admin only)
 *     description: Admin có thể xóa bất kỳ bài viết nào
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền
 */

/**
 * @swagger
 * /api/post/status/{id}:
 *   patch:
 *     tags:
 *       - 📝 Posts
 *     summary: Thay đổi trạng thái bài viết (Admin only)
 *     description: Admin phê duyệt hoặc từ chối bài viết
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       403:
 *         description: Chỉ admin mới có quyền
 */

// =====================================================================
// 🎯 EVENT ROUTES - /api/event
// =====================================================================

/**
 * @swagger
 * /api/event:
 *   get:
 *     tags:
 *       - 🎯 Events
 *     summary: Lấy tất cả sự kiện
 *     description: Lấy danh sách tất cả sự kiện đã được approved
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sự kiện
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *   post:
 *     tags:
 *       - 🎯 Events
 *     summary: Tạo sự kiện mới (Manager only)
 *     description: Manager có thể tạo sự kiện tình nguyện mới
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - location
 *               - startTime
 *               - endTime
 *               - capacity
 *               - categoryId
 *               - managerId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: Chiến dịch dọn rác biển
 *               description:
 *                 type: string
 *                 example: Cùng nhau làm sạch bãi biển và bảo vệ môi trường
 *               location:
 *                 type: string
 *                 minLength: 3
 *                 example: Bãi biển Mỹ Khê, Đà Nẵng
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-01-15T08:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-01-15T12:00:00Z
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 50
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               managerId:
 *                 type: integer
 *                 example: 5
 *               imgUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://res.cloudinary.com/event-image.jpg
 *     responses:
 *       201:
 *         description: Sự kiện được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       403:
 *         description: Chỉ manager mới có quyền tạo sự kiện
 */

/**
 * @swagger
 * /api/event/manager/{userId}:
 *   get:
 *     tags:
 *       - 🎯 Events
 *     summary: Lấy sự kiện của một manager
 *     description: Lấy danh sách tất cả sự kiện do một manager tạo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của manager
 *     responses:
 *       200:
 *         description: Danh sách sự kiện của manager
 */

/**
 * @swagger
 * /api/event/{id}:
 *   put:
 *     tags:
 *       - 🎯 Events
 *     summary: Cập nhật sự kiện (Manager only)
 *     description: Manager có thể cập nhật sự kiện của mình
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *               imgUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /api/event/user/{userId}/event/{eventId}:
 *   delete:
 *     tags:
 *       - 🎯 Events
 *     summary: Xóa sự kiện (Manager hoặc Admin)
 *     description: Manager có thể xóa sự kiện của mình, Admin xóa bất kỳ sự kiện nào
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /api/event/{id}/approval:
 *   patch:
 *     tags:
 *       - 🎯 Events
 *     summary: Thay đổi trạng thái phê duyệt (Admin only)
 *     description: Admin phê duyệt hoặc từ chối sự kiện
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */

/**
 * @swagger
 * /api/event/{id}/progress:
 *   patch:
 *     tags:
 *       - 🎯 Events
 *     summary: Cập nhật tiến độ sự kiện (Manager only)
 *     description: Manager cập nhật trạng thái tiến độ sự kiện
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [incomplete, cancelled, completed]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Cập nhật tiến độ thành công
 */

// =====================================================================
// 💬 COMMENT ROUTES - /api/comment
// =====================================================================

/**
 * @swagger
 * /api/comment:
 *   post:
 *     tags:
 *       - 💬 Comments
 *     summary: Tạo bình luận mới
 *     description: Người dùng có thể bình luận vào bài viết
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - authorId
 *               - content
 *             properties:
 *               postId:
 *                 type: integer
 *                 description: ID của bài viết
 *                 example: 5
 *               authorId:
 *                 type: integer
 *                 description: ID của người bình luận
 *                 example: 10
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 description: Nội dung bình luận
 *                 example: Bài viết rất hay!
 *     responses:
 *       201:
 *         description: Tạo bình luận thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /api/comment/post/{postId}:
 *   get:
 *     tags:
 *       - 💬 Comments
 *     summary: Lấy danh sách bình luận theo bài viết
 *     description: Lấy tất cả bình luận của một bài viết
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Danh sách bình luận
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /api/comment/{commentId}:
 *   put:
 *     tags:
 *       - 💬 Comments
 *     summary: Cập nhật bình luận
 *     description: Người dùng có thể chỉnh sửa bình luận của mình
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Nội dung bình luận đã chỉnh sửa
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     tags:
 *       - 💬 Comments
 *     summary: Xóa bình luận
 *     description: Người dùng có thể xóa bình luận của mình
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

// =====================================================================
// ❤️ LIKE ROUTES - /api/like
// =====================================================================

/**
 * @swagger
 * /api/like:
 *   post:
 *     tags:
 *       - ❤️ Likes
 *     summary: Toggle like bài viết
 *     description: Thêm hoặc bỏ like cho bài viết (toggle)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 5
 *               userId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Like thành công
 *       200:
 *         description: Unlike thành công
 *   delete:
 *     tags:
 *       - ❤️ Likes
 *     summary: Bỏ like bài viết
 *     description: Xóa like khỏi bài viết
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *             properties:
 *               postId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Bỏ like thành công
 */

/**
 * @swagger
 * /api/like/post/{postId}:
 *   get:
 *     tags:
 *       - ❤️ Likes
 *     summary: Lấy danh sách người like bài viết
 *     description: Lấy tất cả người dùng đã like một bài viết
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   postId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   user:
 *                     $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/like/user/{userId}:
 *   get:
 *     tags:
 *       - ❤️ Likes
 *     summary: Lấy danh sách bài viết user đã like
 *     description: Lấy tất cả bài viết mà người dùng đã like
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách likes của user
 */

// =====================================================================
// 📋 APPLICATION ROUTES - /api/application
// =====================================================================

/**
 * @swagger
 * /api/application:
 *   post:
 *     tags:
 *       - 📋 Applications
 *     summary: Đăng ký tham gia sự kiện
 *     description: Volunteer tạo đơn đăng ký tham gia sự kiện
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - userId
 *             properties:
 *               eventId:
 *                 type: integer
 *                 description: ID của sự kiện
 *                 example: 5
 *               userId:
 *                 type: integer
 *                 description: ID của volunteer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Đã đăng ký sự kiện này hoặc sự kiện đã đầy
 */

/**
 * @swagger
 * /api/application/event/{eventId}:
 *   get:
 *     tags:
 *       - 📋 Applications
 *     summary: Lấy danh sách đơn đăng ký của sự kiện
 *     description: Manager hoặc Admin xem danh sách volunteer đăng ký
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách đơn đăng ký
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */

/**
 * @swagger
 * /api/application/volunteer/{volunteerId}:
 *   get:
 *     tags:
 *       - 📋 Applications
 *     summary: Lấy danh sách đơn của volunteer
 *     description: Xem tất cả đơn đăng ký của một volunteer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: volunteerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách đơn của volunteer
 */

/**
 * @swagger
 * /api/application/{id}:
 *   patch:
 *     tags:
 *       - 📋 Applications
 *     summary: Thay đổi trạng thái đơn (Manager only)
 *     description: Manager chấp nhận hoặc từ chối đơn đăng ký
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */

/**
 * @swagger
 * /api/application/{id}/cancel:
 *   patch:
 *     tags:
 *       - 📋 Applications
 *     summary: Hủy đơn đăng ký (Volunteer only)
 *     description: Volunteer có thể hủy đơn đăng ký của mình
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hủy đơn thành công
 */

// =====================================================================
// 🔔 NOTIFICATION ROUTES - /api/notification
// =====================================================================

/**
 * @swagger
 * /api/notification/user/{userId}:
 *   get:
 *     tags:
 *       - 🔔 Notifications
 *     summary: Lấy danh sách thông báo của user
 *     description: Lấy tất cả thông báo của một người dùng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   isRead:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /api/notification/read/{userId}:
 *   put:
 *     tags:
 *       - 🔔 Notifications
 *     summary: Đánh dấu tất cả thông báo đã đọc
 *     description: Đánh dấu tất cả thông báo của user là đã đọc
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đánh dấu thành công
 */

// =====================================================================
// 📁 FILE ROUTES - /api/file
// =====================================================================

/**
 * @swagger
 * /api/file/upload:
 *   post:
 *     tags:
 *       - 📁 Files
 *     summary: Upload file lên Cloudinary
 *     description: Upload hình ảnh hoặc video lên cloud storage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File cần upload (max 5MB)
 *               uploadedBy:
 *                 type: integer
 *                 description: ID của người upload
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/volunteerhub/image/upload/v123456/file.jpg
 *                 publicId:
 *                   type: string
 *                   example: volunteerhub/file
 *       400:
 *         description: File không hợp lệ hoặc quá lớn
 */

// =====================================================================
// 🔔 PUSH NOTIFICATION ROUTES - /api/push
// =====================================================================

/**
 * @swagger
 * /api/push/subscribe:
 *   post:
 *     tags:
 *       - 🔔 Push Notifications
 *     summary: Đăng ký push notification
 *     description: Đăng ký browser để nhận push notifications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - subscription
 *             properties:
 *               userId:
 *                 type: integer
 *               subscription:
 *                 type: object
 *                 description: Push subscription object từ browser
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */

/**
 * @swagger
 * /api/push/unsubscribe:
 *   post:
 *     tags:
 *       - 🔔 Push Notifications
 *     summary: Hủy đăng ký push notification
 *     description: Hủy push notification cho user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Hủy thành công
 */

// =====================================================================
// ✅ DONE - Copy các @swagger blocks vào các file routes tương ứng
// =====================================================================
