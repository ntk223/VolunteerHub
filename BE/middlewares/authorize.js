export function authorize(roles = []) {
  if (roles.length === 0) roles = ["volunteer", "manager", "admin"];
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
}
