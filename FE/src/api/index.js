// src/api/api.js
import axios from "axios";
import { message } from "antd";
import mitt from "mitt"; // npm install mitt

export const apiEvents = mitt(); // Tạo event emitter

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        apiEvents.emit("unauthorized"); // 👈 bắn sự kiện ra ngoài
      }
    } else {
        const isServerError = error.code === "ERR_NETWORK" || (error.response && error.response.status === 500);
    
        if (isServerError) {
            // --- ĐOẠN CODE QUAN TRỌNG CẦN THÊM ---
            // Lấy đường dẫn hiện tại
            const currentPath = window.location.pathname;

            // Nếu KHÔNG PHẢI đang ở trang lỗi thì mới chuyển hướng
            if (currentPath !== "/server-error") {
                // Lưu lại trang cũ để tí back lại (tuỳ chọn)
                const backUrl = encodeURIComponent(currentPath + window.location.search);
                window.location.href = `/server-error?backUrl=${backUrl}`;
            }
        }
      
    }
    return Promise.reject(error);
  }
);

export default api;
