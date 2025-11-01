// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";
import { setupInterceptors } from "./api/index.js"; // ✅ import setupInterceptors

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log("ProtectedRoute isAuthenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppInitializer() {
  const { logout } = useAuth();

  useEffect(() => {
    setupInterceptors(logout); // interceptor sẽ tự logout nếu 401
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

          {/* Admin */}
          <Route path="admin" element={<div>Admin Page</div>} />
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
