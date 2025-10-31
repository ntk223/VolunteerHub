import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm'; 
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // Nếu đã đăng nhập, redirect về trang chủ
  if (isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>VolunteerHub</h1>
          <p>Kết nối với mọi người</p>
        </div>

        <div className="login-content">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;