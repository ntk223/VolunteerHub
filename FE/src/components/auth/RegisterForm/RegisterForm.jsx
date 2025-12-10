import React, { useState } from 'react';
import api from '../../../api';
import FormField from '../../common/FormField';
import toast from 'react-hot-toast';
import "./RegisterForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { message, Select, theme } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const VIETNAMESE_PHONE_REGEX = /^(0|84|\+84)(3|5|7|8|9)[0-9]{8}$/; 

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'volunteer',
  introduce: ''
};

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
    
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  /**
   * @description Kiểm tra số điện thoại hợp lệ
   * @param {string} phone Số điện thoại cần kiểm tra
   * @returns {boolean} True nếu hợp lệ, False nếu không
   */
  const isVietnamesePhoneNumber = (phone) => {
    
    const cleanedPhone = phone.replace(/[\s-]/g, ''); 
    return VIETNAMESE_PHONE_REGEX.test(cleanedPhone);
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, phone, password, confirmPassword } = formData;

    // Họ và tên
    if (!name.trim()) newErrors.name = "Vui lòng nhập họ và tên.";
    
    // Email
    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }
    
    // Số điện thoại 
    if (!phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!isVietnamesePhoneNumber(phone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng.";
    }

    // Mật khẩu
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    
    // Xác nhận mật khẩu
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Hiển thị thông báo lỗi chung nếu có lỗi validation
      toast.error('Vui lòng điền đầy đủ và chính xác thông tin đăng ký.'); 
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...dataToSubmit } = formData;
      // Thêm bước làm sạch số điện thoại trước khi gửi lên API
      dataToSubmit.phone = dataToSubmit.phone.replace(/[\s-]/g, ''); 
      await api.post('/auth/register', dataToSubmit);

      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      onSwitchToLogin();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      
      if (errorMessage === "Email already in use") { 
        setErrors({ email: "Email đã được sử dụng" });
        toast.error("Email đã được sử dụng.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Đăng ký</h2>

      <form onSubmit={handleSubmit} noValidate>
        
        <FormField
          id="name" label="Họ và tên" name="name" type="text"
          value={formData.name} onChange={handleChange} error={errors.name}
        />
        <FormField
          id="email" label="Email" name="email" type="email"
          value={formData.email} onChange={handleChange} error={errors.email}
        />
        <FormField
          id="phone" label="Số điện thoại" name="phone" type="tel"
          value={formData.phone} onChange={handleChange} error={errors.phone}
        />

        {/* Mật khẩu */}
        <div className="form-group password-wrapper">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
          />
          <span onClick={togglePasswordVisibility} className="password-toggle-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="form-group password-wrapper">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
        
        {/* Vai trò */}
        <div className="form-group">
          <label htmlFor="role">Vai trò</label>
          <Select
            id="role"
            value={formData.role}
            onChange={(value) => handleChange({ target: { name: 'role', value } })}
            suffixIcon={<UserOutlined />}
            style={{ width: '100%' }}
            size="large"
            options={[
              { value: 'volunteer', label: 'Tình nguyện viên' },
              { value: 'manager', label: 'Quản lý' },
            ]}
            popupClassName="role-select-dropdown"
          />
        </div>

        

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>

      
    </div>
  );
}

export default RegisterForm;