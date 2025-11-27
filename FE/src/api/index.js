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
    }
    return Promise.reject(error);
  }
);

export default api;
