import Cookies from "js-cookie";
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { authApi } from '../../../services/api/authApi';
import './LoginForm.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    const response = await authApi.login(formData.email, formData.password, formData.role);
    
    // ✅ Lưu token vào cookie
    Cookies.set("access_token", response.token, {
      expires: 7, // 7 ngày hết hạn
      secure: true, // chỉ gửi qua HTTPS
      sameSite: "Strict", // tránh bị CSRF
    });

    // ✅ Nếu bạn vẫn dùng context để lưu user info
    await login(response.user, response.token);

    // ✅ Chuyển hướng sau khi đăng nhập
    window.location.href = '/';
  } catch (err) {
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