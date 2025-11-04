import Cookies from "js-cookie";
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.jsx';
import api from '../../../api/index.js';
import { FaEye, FaEyeSlash } from "react-icons/fa";


import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'volunteer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

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
      if (user.role === 'admin') {
        navigate('/admin'); 
      } else {
        navigate('/'); 
      }

    } catch (err) {
      console.error("Login failed:", err);
      console.log('Error response data:', err.response?.data);
      const message = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    // Component này chỉ nên trả về thẻ <form> để khớp với cấu trúc CSS
    <form onSubmit={handleSubmit}>
      <h1>Đăng nhập</h1>

      <span>Sử dụng email/mật khẩu</span>

      {/* Hiển thị lỗi */}
      {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}

      {/* Trường Email */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        disabled={loading}
      />

      {/* Trường Mật khẩu (Sử dụng wrapper nếu bạn muốn icon hiển thị bên trong) */}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
          required
          disabled={loading}
        />
        {/* Nút bật/tắt mật khẩu */}
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#333'
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>


      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        disabled={loading}

        style={{
          backgroundColor: '#eee',
          border: 'none',
          margin: '4px 0',
          padding: '10px 15px',
          fontSize: '13px',
          borderRadius: '8px',
          width: '100%',
          outline: 'none',
        }}
      >
        <option value="volunteer">Tình nguyện viên</option>
        <option value="manager">Quản lý</option>
        <option value="admin">Quản trị viên</option>
      </select>


      <a href="#">Quên mật khẩu?</a>


      <button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm;