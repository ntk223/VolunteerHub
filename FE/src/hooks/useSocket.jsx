// src/hooks/useSocket.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth.jsx";
import api from "../api"; // ⚠️ 1. Import api vào đây
import { message } from "antd";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:5000";

// 2. Cập nhật Context để cung cấp object { socket, notifications }
const SocketContext = createContext({
  socket: null,
  notifications: [],
});

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  // 3. Chuyển state thông báo vào đây
  const [notifications, setNotifications] = useState([]);
  const userId = user?.id; // Lấy userId ra biến riêng
    const markNotificationsAsRead = async () => {
    try {
      if (notifications.length === 0) return; // Không có thông báo nào để đánh dấu
      await api.put(`/notification/read/${userId}`);
      // Cập nhật trạng thái thông báo trong state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    }
  };
  // Effect 1: Quản lý KẾT NỐI Socket (gần như cũ)
  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        console.log("🧹 Socket disconnected (no token/logout)");
      }
      return;
    }

    // Chỉ tạo mới nếu chưa có socket
    if (!socket) {
      const newSocket = io(SOCKET_SERVER_URL, {
        auth: { token: token },
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        console.log("🔌 Socket connected:", newSocket.id);
        if (userId) {
          newSocket.emit("joinUserRoom", userId);
        }
      });
      
      newSocket.on("disconnect", (reason) => {
        console.log("⚠️ Socket disconnected:", reason);
      });
      
      setSocket(newSocket);
    }
    
    // Không cần cleanup ở đây, vì ta muốn socket tồn tại
    // Việc cleanup đã xử lý ở block `!token`
  }, [token, userId]); // Phụ thuộc vào token và userId

  // 4. Effect 2: Quản lý DỮ LIỆU Thông báo (Fetch + Listen)
  useEffect(() => {
    // Chỉ chạy khi có user ID và socket đã kết nối
    if (!userId || !socket) {
      // Nếu user logout, xoá thông báo cũ
      if (!userId) {
          setNotifications([]);
      }
      return;
    }

    // --- Bê logic từ Page vào đây ---
    
    // 1️⃣ Lấy danh sách thông báo (logic của bạn)
    const fetchNotifications = async () => {
      try {
        // Dùng `userId` từ biến ở trên
        const res = await api.get(`/notification/user/${userId}`);
        if (Array.isArray(res.data)) {
        setNotifications(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông báo (từ hook):", error);
      }
    };

    fetchNotifications();
    // Hàm đánh dấu thông báo đã đọc

    // 2️⃣ Lắng nghe thông báo realtime (logic của bạn)
    const handleNotification = (data) => {
      console.log("📩 Nhận thông báo mới (từ hook):", data);
      message.info(`Thông báo mới: ${data.message}`);
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("newNotification", handleNotification);
    // --- Hết logic từ Page ---

    // Cleanup khi user thay đổi hoặc socket thay đổi
    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [userId, socket]); // Phụ thuộc vào userId và socket

  // 5. Cung cấp cả socket và notifications
  const contextValue = {
    socket,
    notifications,
    markNotificationsAsRead,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// 6. Hook `useSocket` giờ sẽ trả về object
export const useSocket = () => {
  return useContext(SocketContext);
};