import React, { useState } from 'react';
import { authApi } from "../../../services/api/authApi";

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'volunteer',
    introduce: ''
  });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authApi.register(formData);
            // Sau khi đăng ký thành công, chuyển sang form đăng nhập
            onSwitchToLogin();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-form">
            <h2>Đăng ký</h2>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Họ và tên</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Vai trò</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="volunteer">Tình nguyện viên</option>
                        <option value="manager">Quản lý</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="introduce">Giới thiệu bản thân</label>
                    <textarea
                        id="introduce"
                        name="introduce"
                        value={formData.introduce}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="register-button" disabled={loading}>
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
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
