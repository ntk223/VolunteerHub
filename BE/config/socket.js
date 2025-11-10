import { Server } from "socket.io";
// Giả sử corsOptions là một object, ví dụ: { origin: "http://localhost:3000", ... }
// import { corsOptions } from "./cors.js"; 
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    // 💡 Sử dụng corsOptions đã import thay vì hardcode
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
  });

  // ⚠️ Chỉ dùng MỘT listener "connection"
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Client gửi userId khi đăng nhập
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`✅ User ${userId} joined room user_${userId}`);
    });

    // Đặt listener "disconnect" vào chung đây
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });

    // Bạn có thể thêm các listener khác của socket ở đây
    // ví dụ: socket.on("sendMessage", (data) => { ... });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io chưa được khởi tạo!");
  return io;
};