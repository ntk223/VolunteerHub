import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;
  console.log("ProtectedRoute isAuthenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
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
            {/* 👇 Route con được render trong <Outlet /> */}
            <Route index element={<Navigate to="discuss" replace />} />
  
            {/* Bọc element, không bọc Route */}
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
              <Route path="admin" element={<div>Admin Page</div>} />

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/discuss" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
