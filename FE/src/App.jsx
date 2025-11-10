import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import { AdminProvider } from "./hooks/useAdminData.jsx";
import { SocketProvider } from "./hooks/useSocket.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";
import AdminPage from "./pages/Admin/AdminPage"; 
import MyProfile from "./pages/Profile/MyProfile.jsx";
import OtherProfile from "./pages/Profile/OtherProfile.jsx";
import NotificationPage from "./pages/Notification/NotificationPage.jsx";
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
                <div>Recruitment Page</div>
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
            path="notification"
            element={
              <NotificationPage />
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
        <SocketProvider>
          <AppInitializer />
        </SocketProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}