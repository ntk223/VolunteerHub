import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { PostsProvider } from "./hooks/usePosts.jsx";
import { AdminProvider } from "./hooks/useAdminData.jsx";
import { SocketProvider } from "./hooks/useSocket.jsx";
import { SearchProvider } from "./hooks/useSearch.jsx";
import { EventsProvider } from "./hooks/useEvents.jsx"; // 1. Import EventsProvider

// Import useTheme để lấy trạng thái theme hiện tại
import { ThemeProvider, useTheme } from "./hooks/useTheme.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DiscussPage from "./pages/Feed/DiscussPage";
import RecruitmentPage from "./pages/Feed/RecruitmentPage";
import EventPost from "./pages/Feed/EventPost";
import AdminPage from "./pages/Admin/AdminPage";
import MyProfile from "./pages/Profile/MyProfile.jsx";
import OtherProfile from "./pages/Profile/OtherProfile.jsx";
import NotificationPage from "./pages/Notification/NotificationPage.jsx";
import UserPost from "./pages/Profile/UserPost.jsx";
import OnePost from "./pages/Feed/OnePost.jsx";
import SearchPage from "./pages/Search/SearchPage.jsx";
import ManageEvent from "./pages/ManageEvent/ManageEvent.jsx";
import EventsPage from "./pages/Event/EventsPage.jsx"; // 2. Import EventsPage
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import ServerErrorPage from "./pages/ServerErrorPage/ServerErrorPage.jsx";
import ManageApplications from "./pages/ManageApplications/ManageApplications";

import 'antd/dist/reset.css';
// Import theme từ antd
import { ConfigProvider, theme } from 'antd';

import './App.css';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/landing" replace />;
};

function AppInitializer() {
    // Lấy biến xác định dark mode từ hook
    const { isDarkMode } = useTheme();

    return (
        // Cấu hình ConfigProvider bao bọc toàn bộ ứng dụng
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    // Concept "Nhiệt Huyết Tuổi Trẻ" (Coral + Navy Blue)
                    colorPrimary: isDarkMode ? '#FF7A45' : '#FA541C', // Dark: Cam sáng hơn, Light: Cam san hô
                    colorInfo: isDarkMode ? '#177DDC' : '#003A8C', // Dark: Xanh sáng, Light: Navy
                    colorSuccess: '#52C41A', // Xanh lá - Thành công
                    colorWarning: '#FF7A45', // Cam nhạt - Cảnh báo
                    colorBgLayout: isDarkMode ? '#18191A' : '#FFF7F0', // Dark: Đen nhạt Facebook, Light: Ấm áp
                    colorBgContainer: isDarkMode ? '#242526' : '#FFFFFF', // Dark: Xám đen Facebook, Light: Trắng
                    colorText: isDarkMode ? '#E4E6EB' : 'rgba(0, 0, 0, 0.88)', // Text như Facebook
                    colorTextSecondary: isDarkMode ? '#B0B3B8' : 'rgba(0, 0, 0, 0.45)',
                    colorBorder: isDarkMode ? '#3A3B3C' : '#FFD8BF',
                    colorLink: isDarkMode ? '#FF7A45' : '#FA541C', // Link theo theme
                    colorLinkHover: isDarkMode ? '#FFA940' : '#FF7A45', // Hover sáng hơn
                    borderRadius: 8,
                    fontSize: 14,
                },
                components: {
                    Button: {
                        borderRadius: 6,
                        controlHeight: 36,
                    },
                    Card: {
                        borderRadiusLG: 12,
                    },
                },
            }}
        >
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/auth/:mode" element={
                        <ConfigProvider
                            theme={{
                                algorithm: theme.defaultAlgorithm,
                                token: {
                                    colorBgBase: '#ffffff',
                                    colorTextBase: '#000000',
                                    colorBgContainer: '#ffffff',
                                    colorBgLayout: '#ffffff',
                                    colorText: 'rgba(0, 0, 0, 0.88)',
                                    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
                                }
                            }}
                        >
                            <Login />
                        </ConfigProvider>
                    } />
                    
                    <Route path="/landing" element={
                        <ConfigProvider
                            theme={{
                                algorithm: theme.defaultAlgorithm,
                                token: {
                                    colorBgBase: '#ffffff',
                                    colorTextBase: '#000000',
                                    colorBgContainer: '#ffffff',
                                    colorBgLayout: '#ffffff',
                                    colorText: 'rgba(0, 0, 0, 0.88)',
                                    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
                                }
                            }}
                        >
                            <LandingPage />
                        </ConfigProvider>
                    } />
                    
                    <Route path="/server-error" element={<ServerErrorPage />} />

                    {/* Protected Routes Wrapper */}
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
                        {/* Nested Routes (Children of Home) */}
                        <Route index element={<Navigate to="discuss" replace />} />
                        
                        {/* 3. Thêm Route cho trang danh sách sự kiện */}
                        <Route
                            path="events"
                            element={
                                <EventsProvider>
                                    <EventsPage />
                                </EventsProvider>
                            }
                        />

                        <Route
                            path="manage-events"
                            element={<ManageEvent />}
                        />
                        
                        <Route
                            path="manage-applications"
                            element={<ManageApplications />}
                        />

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
                            path="event-posts/:eventId"
                            element={
                                <PostsProvider postType={null}>
                                    <EventPost />
                                </PostsProvider>
                            }
                        />

                        <Route path="profile" element={<MyProfile />} />
                        <Route path="profile/:id" element={<OtherProfile />} />
                        <Route path="notification" element={<NotificationPage />} />
                        
                        <Route path="search" element={<SearchPage />} />

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
                                <EventsProvider>
                                    <AdminProvider>
                                        <AdminPage />
                                    </AdminProvider>
                                </EventsProvider>
                            }
                        />
                    </Route>
                    {/* End Protected Routes */}

                    {/* Catch all - 404 */}
                    <Route path="*" element={<Navigate to="/discuss" replace />} />
                </Routes>
            </Router>
        </ConfigProvider>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    <EventsProvider>
                    <AppInitializer />
                    </EventsProvider>
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}