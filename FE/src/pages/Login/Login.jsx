import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
// Import các component form
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import './Login.css';
import logo from '/logo.png';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // Nếu đã đăng nhập, redirect về trang chủ
  if (isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  // Quyết định class 'active' dựa trên trạng thái (isLogin = false -> Active, hiển thị Register)
  const containerClass = isLogin ? 'container' : 'container active';

  return (
    // Sử dụng class login-page-wrapper (từ CSS của bạn) để căn giữa toàn bộ trang
    <div className="login-page-wrapper">
      {/* Container chính, áp dụng hiệu ứng chuyển đổi bằng class 'active' */}
      <div className={containerClass}>

        {/* Form Đăng ký (Sign Up) - Vị trí bên phải khi Active */}
        <div className="form-container sign-up">
          {/* Form này sẽ được ẩn/hiện bằng CSS */}
          <RegisterForm />
        </div>

        {/* Form Đăng nhập (Sign In) - Vị trí bên trái */}
        <div className="form-container sign-in">
          {/* Form này sẽ được ẩn/hiện bằng CSS */}
          <LoginForm />
        </div>

        {/* Panel Lật (Overlay) - Chứa các nút chuyển đổi */}
        <div className="toggle-container">
          <div className="toggle">

            {/* Panel Chào mừng (bên trái) - Hiển thị khi đang ở chế độ Đăng ký */}
            <div className="toggle-panel toggle-left">
              <img
                src={logo}
                alt="VolunteerHub Logo"
                className="toggle-logo"
                style={{ marginBottom: '20px', width: '100px', height: '100px', borderRadius: '50%' }}
              />
              <h1>Chào mừng trở lại!</h1>
              <p>Tiếp tục hành trình kết nối cộng đồng của bạn.</p>
              {/* Nút chuyển về Đăng nhập (nút này có class 'hidden' trong CSS) */}
              <button className="hidden" onClick={() => setIsLogin(true)}>
                Đăng nhập
              </button>
            </div>

            {/* Panel Đăng ký (bên phải) - Hiển thị khi đang ở chế độ Đăng nhập */}
            <div className="toggle-panel toggle-right">
              <img
                src={logo}
                alt="VolunteerHub Logo"
                className="toggle-logo"
                style={{ marginBottom: '20px', width: '100px', height: '100px', borderRadius: '50%' }}
              />
              <h1>Xin chào, Bạn!</h1>
              <p>Đăng ký để tham gia và kết nối cùng cộng đồng tình nguyện viên.</p>

              <button className="hidden" onClick={() => setIsLogin(false)}>
                Đăng ký
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;