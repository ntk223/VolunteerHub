// src/hooks/useTheme.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Lấy theme từ localStorage (mặc định là false/sáng)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // 2. Hàm chuyển đổi theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 3. Effect: Cập nhật CSS variables & localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {/* 4. Cấu hình Ant Design ngay tại đây */}
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
             // Bạn có thể chỉnh màu chủ đạo ở đây nếu muốn
             colorPrimary: '#1677ff', 
          }
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);