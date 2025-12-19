// src/hooks/useSocket.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth.jsx";
import api from "../api";
import { message } from "antd";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:5000";

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
  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        console.log("🧹 Socket disconnected (no token/logout)");
      }
      return;
    }

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

  }, [token, userId]); // Phụ thuộc vào token và userId

  useEffect(() => {
    if (!userId || !socket) {
      if (!userId) {
          setNotifications([]);
      }
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notification/user/${userId}`);
        
        setNotifications(res.data);
        
      } catch (error) {
        console.error("Lỗi khi tải thông báo (từ hook):", error);
      }
    };

    fetchNotifications();

    // Lắng nghe thông báo realtime
    const handleNotification = (data) => {
      console.log("📩 Nhận thông báo mới (từ hook):", data);
      message.info(`Thông báo mới: ${data.message}`);
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [userId, socket]); // Phụ thuộc vào userId và socket

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

export const useSocket = () => {
  return useContext(SocketContext);
};