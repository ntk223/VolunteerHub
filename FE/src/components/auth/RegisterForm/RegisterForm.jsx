import React, { useState } from 'react';
import { authApi } from "../../../services/api/authApi";
import FormField from '../../common/FormField'; // Giả sử bạn tạo file FormField
// Để có thông báo đẹp, bạn có thể dùng thư viện như react-hot-toast
// npm install react-hot-toast
import toast from 'react-hot-toast';
import "./RegisterForm.css";

// Tách state khởi tạo ra ngoài để tránh tạo lại mỗi lần render
const initialFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '', // Thêm trường xác nhận mật khẩu
  role: 'volunteer',
  introduce: ''
};

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({}); // Dùng object để lưu lỗi cho từng trường
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Xóa lỗi của trường đang nhập khi người dùng thay đổi giá trị
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Kiểm tra tên
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên.";
    
    // Kiểm tra email
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }

    // Kiểm tra số điện thoại (ví dụ đơn giản)
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại.";

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    // Kiểm tra xác nhận mật khẩu
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
      return; // Dừng lại nếu có lỗi
    }

    setLoading(true);
    setErrors({});

    try {
      // Không gửi confirmPassword lên server
      const { confirmPassword, ...dataToSubmit } = formData;
      await authApi.register(dataToSubmit);
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      onSwitchToLogin(); // Chuyển sang form đăng nhập

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
      // Có thể set lỗi cho một trường cụ thể nếu server trả về, ví dụ:
      // if (err.response?.data?.field === 'email') {
      //   setErrors({ email: 'Email này đã được sử dụng.' });
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      <h2>Đăng ký</h2>

      <form onSubmit={handleSubmit} noValidate> {/* Thêm noValidate để tắt validation mặc định của trình duyệt */}
        <FormField
          id="name"
          label="Họ và tên"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        <FormField
          id="email"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          id="phone"
          label="Số điện thoại"
          name="phone"
          type="tel" // Dùng type="tel" cho số điện thoại
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <FormField
          id="password"
          label="Mật khẩu"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormField
          id="confirmPassword"
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        
        {/* Các trường còn lại không cần validation phức tạp có thể giữ nguyên */}
        <div className="form-group">
            <label htmlFor="role">Vai trò</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
                <option value="volunteer">Tình nguyện viên</option>
                <option value="manager">Quản lý</option>
            </select>
        </div>

        <div className="form-group">
            <label htmlFor="introduce">Giới thiệu bản thân</label>
            <textarea id="introduce" name="introduce" value={formData.introduce} onChange={handleChange} />
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>

      <p className="switch-form">
        Đã có tài khoản?{' '}
        <button type="button" onClick={onSwitchToLogin} disabled={loading}>
          Đăng nhập
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;