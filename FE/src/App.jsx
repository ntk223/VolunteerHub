import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import { AdminProvider } from "./hooks/useAdminData.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";
import RecruitmentPage from "./pages/Feed/RecruitmentPage";
import AdminPage from "./pages/Admin/AdminPage"; 
import MyProfile from "./pages/Profile/MyProfile.jsx";
import OtherProfile from "./pages/Profile/OtherProfile.jsx";
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log("ProtectedRoute isAuthenticated:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function AppInitializer() {

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
                <RecruitmentPage />
              </PostsProvider>
            }
          />
          <Route
            path="profile"
            element={
                <MyProfile />
            }
          />
          <Route
            path="profile/:id"
            element={
              <OtherProfile />
            }
          />

          <Route
            path="admin/*" 
            element={
              <AdminProvider>
                <AdminPage /> 
              </AdminProvider>
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
    <ConfigProvider>
      <AuthProvider>
        <AppInitializer />
      </AuthProvider>
    </ConfigProvider>
  );
}