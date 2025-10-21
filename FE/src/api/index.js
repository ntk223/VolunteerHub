import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // base URL cho tất cả request
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor 1: Gắn token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor 2: Xử lý lỗi phản hồi (response)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        Cookies.remove("access_token");
        window.location.href = "/login"; // hoặc gọi hàm logout từ context
      } else {
        message.error(error.response.data?.message || "Có lỗi xảy ra khi gọi API");
      }
    } else {
      message.error("Không thể kết nối đến server");
    }
    return Promise.reject(error);
  }
);

export default api;
