import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.jsx';
import api from '../../../api/index.js';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { message, Select, theme } from "antd";
import { UserOutlined } from '@ant-design/icons';

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
  const { token } = theme.useToken();

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
      // Gọi API đăng nhập
      const res = await api.post('/auth/login', formData);

      const { user, token } = res.data;
      await login(user, token);
      message.success('Đăng nhập thành công!');

    } catch (err) {
      const statusCode = err.response?.status;
      const listError = {
        400: 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
        401: 'Email hoặc mật khẩu không đúng.',
        403: 'Tài khoản của bạn không có quyền truy cập.',
        500: 'Lỗi máy chủ. Vui lòng thử lại sau.'
      }
      const messageErr = listError[statusCode] || 'Đăng nhập thất bại. Vui lòng thử lại.';
      message.error(messageErr);
      setError(messageErr);
    } finally {
      setLoading(false);
    }
  };


  return (
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


      <Select
        value={formData.role}
        onChange={(value) => handleChange({ target: { name: 'role', value } })}
        disabled={loading}
        suffixIcon={<UserOutlined />}
        style={{
          width: '100%',
          margin: '4px 0',
        }}
        size="large"
        options={[
          { value: 'volunteer', label: 'Tình nguyện viên' },
          { value: 'manager', label: 'Quản lý' },
          { value: 'admin', label: 'Quản trị viên' },
        ]}
        popupClassName="role-select-dropdown"
      />

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