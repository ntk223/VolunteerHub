import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import { AdminProvider } from "./hooks/useAdminData.jsx";
import { SocketProvider } from "./hooks/useSocket.jsx";
import { SearchProvider } from "./hooks/useSearch.jsx";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";
import RecruitmentPage from "./pages/Feed/RecruitmentPage";
import AdminPage from "./pages/Admin/AdminPage";
import MyProfile from "./pages/Profile/MyProfile.jsx";
import OtherProfile from "./pages/Profile/OtherProfile.jsx";
import NotificationPage from "./pages/Notification/NotificationPage.jsx";
import UserPost from "./pages/Profile/UserPost.jsx";
import OnePost from "./pages/Feed/OnePost.jsx";
import SearchPage from "./pages/Search/SearchPage.jsx";
import ManageEvent from "./pages/ManageEvent/ManageEvent.jsx";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import ServerErrorPage from "./pages/ServerErrorPage/ServerErrorPage.jsx";
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';

import './App.css';
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/landing" replace />;
};

function AppInitializer() {
    return (
        <Router>
                <Routes>
                    {/* Public */}
                    <Route path="/auth/:mode" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <SearchProvider>
                                    <Home />
                                </SearchProvider>
                            </ProtectedRoute>
                        }
                    >
                        {/* Manager events page */}
                        <Route
                            path="manage-events"
                            element={<ManageEvent />}
                        />
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

                        <Route path="profile" element={<MyProfile />} />
                        <Route path="profile/:id" element={<OtherProfile />} />
                        <Route path="notification" element={<NotificationPage />} />
                        <Route path="search" element={
                            <SearchProvider>
                                <SearchPage />
                            </SearchProvider>
                        } />

                        <Route
                            path="user/posts/:id"
                            element={
                                <PostsProvider postType={null}>
                                    <UserPost />
                                </PostsProvider>
                            }
                        />
                        <Route
                            path="post/:id"
                            element={
                                <PostsProvider postType={null}>
                                    <OnePost />
                                </PostsProvider>
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

                    <Route path="*" element={<Navigate to="/discuss" replace />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/server-error" element={<ServerErrorPage />} />
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