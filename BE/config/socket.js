import { Server } from "socket.io";
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
  });

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
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io chưa được khởi tạo!");
  return io;
};