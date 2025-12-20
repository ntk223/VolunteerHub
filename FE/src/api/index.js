import axios from "axios";
import { message } from "antd";
import mitt from "mitt";

export const apiEvents = mitt();
const test = "https://nrgmfdfl-5000.asse.devtunnels.ms/api/"
const local = "http://localhost:5000/api"
const api = axios.create({
  baseURL: local,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Cho phép gửi cookie
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
      const currentPath = window.location.pathname;
      const whitelist = ["/auth/login", "/auth/register", "/server-error", "/landing"];
      if (status === 401 && !whitelist.includes(currentPath)) {
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        apiEvents.emit("unauthorized");
      }
    } else {
        const isServerError = error.code === "ERR_NETWORK" || (error.response && error.response.status === 500);
    
        if (isServerError) {
            // Lấy đường dẫn hiện tại
            const currentPath = window.location.pathname;
            if (currentPath !== "/server-error") {
                // Lưu lại trang cũ để tí back lại
                const backUrl = encodeURIComponent(currentPath + window.location.search);
                window.location.href = `/server-error?backUrl=${backUrl}`;
            }
        }
      
    }
    return Promise.reject(error);
  }
);

export default api;
