// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";
import AdminPage from "./pages/Admin/AdminPage"; // 💡 Import AdminPage
import { setupInterceptors } from "./api/index.js"; 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log("ProtectedRoute isAuthenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    // Chưa đăng nhập -> về Login
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/discuss" replace />; 
  }

  // Đã đăng nhập VÀ là Admin -> OK
  return children;
};


function AppInitializer() {
  const { logout } = useAuth();

  useEffect(() => {
    setupInterceptors(logout); 
  }, [logout]);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Private - Home layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="discuss" replace />} />

          {/* Discuss */}
          <Route
            path="discuss"
            element={
              <PostsProvider postType="discuss">
                <DiscussPage />
              </PostsProvider>
            }
          />

          {/* Recruitment */}
          <Route
            path="recruitment"
            element={
              <PostsProvider postType="recruitment">
                <div>Recruitment Page</div>
              </PostsProvider>
            }
          />
          
          
        </Route>
        
       
        <Route 
          path="/admin/*" // Dùng /* để cho phép các tuyến đường con (vd: /admin/users)
          element={
            <AdminRoute>
              {/* Đây là nơi bạn đặt layout Admin chính, ví dụ: AdminLayout hoặc AdminPage */}
              <AdminPage /> 
            </AdminRoute>
          } 
        />


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/discuss" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInitializer />
    </AuthProvider>
  );
}