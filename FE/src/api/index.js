// src/api/api.js
import axios from "axios";
import { message } from "antd";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupInterceptors = (logout) => {
  // Thêm token vào mọi request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Xử lý lỗi phản hồi
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          logout(); // ✅ gọi hàm logout() từ useAuth
        } else {
          message.error(error.response.data?.message || "Có lỗi xảy ra khi gọi API");
        }
      } else {
        message.error("Không thể kết nối đến server");
      }

      return Promise.reject(error);
    }
  );
};

export default api;
