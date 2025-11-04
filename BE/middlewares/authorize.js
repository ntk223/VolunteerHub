export function authorize(roles = []) {
  if (roles.length === 0) roles = ["volunteer", "manager", "admin"];
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    // Nếu không có req.user (người dùng chưa được xác thực), nên trả về 401
    if (!req.user || !req.user.role) {
      // Trường hợp này nên được verifyTokenMiddleware xử lý, nhưng đây là một lớp bảo vệ bổ sung
      return res.status(401).json({ message: "Vui lòng đăng nhập" }); 
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
}
