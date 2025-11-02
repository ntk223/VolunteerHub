import React, { useState } from 'react';
import api from '../../../api/index.js'; // <= Đảm bảo đối tượng này có thể gọi .post()
import FormField from '../../common/FormField';
import toast from 'react-hot-toast';
import "./RegisterForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên.";
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại.";
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...dataToSubmit } = formData;
      
     
      await api.post('/auth/register', dataToSubmit);

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      onSwitchToLogin();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      
      if (errorMessage === "Email already in use") { 
        setErrors({ email: "Email đã được sử dụng" });
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
        {/* Các trường Name, Email, Phone */}
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
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="volunteer">Tình nguyện viên</option>
            <option value="manager">Quản lý</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        {/* Giới thiệu bản thân */}
        

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>

      
    </div>
  );
}

export default RegisterForm;