import Cookies from "js-cookie";
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.jsx';
import api from '../../../api/index.js';
import './LoginForm.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ColumnGroup from "antd/es/table/ColumnGroup.js";

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'volunteer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // thêm state để quản lý việc ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // bật/tắt trạng thái hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    console.log('Submitting login form with data:', formData);

    // Gọi API đăng nhập
    const res = await api.post('/auth/login', formData);
    console.log('Login response:', res);

    const { user, token } = res.data;

    // Lưu token vào cookie
    Cookies.set("access_token", token, {
      expires: 7,
      secure: window.location.protocol === "https:",
      sameSite: "Strict",
    });

    // Gọi hàm login trong context
    await login(user, token);

    // Chuyển hướng về trang chủ
    window.location.href = '/';
  } catch (err) {
    console.error("Login failed:", err);
    setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-form">
      <h2>Đăng nhập</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email của bạn"
            required
            disabled={loading}
          />
        </div>

        {/* cập nhật khối HTML cho trường mật khẩu */}
        <div className="form-group password-wrapper">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
            disabled={loading}
          />
          <span onClick={togglePasswordVisibility} className="password-toggle-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="role">Vai trò</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="volunteer">Tình nguyện viên</option>
            <option value="manager">Quản lý</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="form-footer">
        <p>
          Chưa có tài khoản? 
          <button 
            type="button" 
            className="switch-button"
            onClick={onSwitchToRegister}
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;