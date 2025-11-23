import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
// Import các component form
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import './Login.css';
import logo from '../../assets/AppLogo.png';
import { useParams } from 'react-router-dom';
const Login = () => {
  const { mode } = useParams();
  const [isLogin, setIsLogin] = useState(mode !== 'register');
  const { isAuthenticated } = useAuth();
  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  // Nếu đã đăng nhập, redirect về trang chủ
  if (isAuthenticated) {
    window.location.href = '/';
    return null;
  }

 
  const containerClass = isLogin ? 'container' : 'container active';

  return (
    
    <div className="login-page-wrapper">
      <div className={containerClass}>
        <div className="form-container sign-up">
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        </div>

        {/* Form Đăng nhập (Sign In) - Vị trí bên trái */}
        <div className="form-container sign-in">
          <LoginForm />
        </div>

        {/* Panel Lật (Overlay) - Chứa các nút chuyển đổi */}
        <div className="toggle-container">
          <div className="toggle">

            
            <div className="toggle-panel toggle-left">
              <img
                src={logo}
                alt="VolunteerHub Logo"
                className="toggle-logo"
                style={{ marginBottom: '20px', width: '100px', height: '100px', borderRadius: '50%' }}
              />
              <h1>Chào mừng trở lại!</h1>
              <p>Tiếp tục hành trình kết nối cộng đồng của bạn.</p>
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