import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";
import AdminPage from "./pages/Admin/AdminPage"; 
import Profile from "./pages/Profile/Profile.jsx";
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

        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home /> 
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="discuss" replace />} />

          
          <Route
            path="discuss"
            element={
              <PostsProvider postType="discuss">
                <DiscussPage />
              </PostsProvider>
            }
          />
          <Route
            path="recruitment"
            element={
              <PostsProvider postType="recruitment">
                <div>Recruitment Page</div>
              </PostsProvider>
            }
          />
          <Route
            path="profile"
            element={
                <Profile />
            }
          />

          <Route
            path="admin/*" // Path sẽ là /admin
            element={
              <AdminRoute>
                <AdminPage /> 
              </AdminRoute>
            }
          />

        </Route>
        
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