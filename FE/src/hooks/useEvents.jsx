import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import api from "../api";
import { useAuth } from "./useAuth.jsx";

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]); // Lưu events gốc để sorting/filtering
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('upcoming'); // 'upcoming' (mới nhất/sắp tới) hoặc 'popularity' (đông người tham gia)

  // 🔹 State quản lý sự kiện user đã tham gia (để hiển thị nút Join/Joined nhanh)
  const [userJoinedEvents, setUserJoinedEvents] = useState({}); 

  // 🔹 Lấy danh sách sự kiện
  useEffect(() => {
    setLoading(true);
    
    const fetchEvents = async () => {
      try {
        // API GET /event - lấy tất cả sự kiện
        const res = await api.get(`/event`);
        
        // Filter chỉ lấy events đã được duyệt
        const approvedEvents = res.data.filter(e => e.approvalStatus === 'approved');

        setOriginalEvents(approvedEvents);
        setEvents(approvedEvents);
      } catch (err) {
        console.error("Lỗi tải sự kiện:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]); // Reload khi user đổi

  // 🔹 Kiểm tra danh sách các sự kiện mà user hiện tại đã tham gia
  useEffect(() => {
    const fetchUserJoinedStatus = async () => {
      if (!user?.id) return;
      try {
        // API GET /application/volunteer/:volunteerId - lấy danh sách đơn của volunteer
        const res = await api.get(`/application/volunteer/${user.id}`);
        const applications = res.data;

        // Tạo map các eventId đã apply với status accepted
        const joinedMap = {};
        applications.forEach(app => {
          if (app.status === 'accepted' && app.eventId) {
            joinedMap[app.eventId] = true;
          }
        });
        setUserJoinedEvents(joinedMap);
      } catch (error) {
        console.error("Lỗi tải trạng thái tham gia sự kiện của user:", error);
      }
    };
    fetchUserJoinedStatus();
  }, [user?.id]);

  // 🔹 Sắp xếp sự kiện
  const sortEvents = useCallback((eventsList, sortType) => {
    const sorted = [...eventsList];
    
    if (sortType === 'popularity') {
      return sorted.sort((a, b) => {
        // Sắp xếp theo số lượng người tham gia giảm dần
        const countA = a.applicationsCount || 0;
        const countB = b.applicationsCount || 0;
        return countB - countA;
      });
    } else {
      // 'upcoming' hoặc mặc định: Sắp xếp theo ngày bắt đầu (Gần nhất lên đầu)
      return sorted.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
      });
    }
  }, []);

  // 🔹 Effect thực thi sắp xếp khi sortBy hoặc data gốc thay đổi
  useEffect(() => {
    if (originalEvents.length > 0) {
      const sorted = sortEvents(originalEvents, sortBy);
      setEvents(sorted);
    }
  }, [sortBy, originalEvents, sortEvents]);

  // 🔹 Hàm thay đổi kiểu sắp xếp
  const changeSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  // 🔹 Hành động: Tham gia sự kiện (tạo application)
  const joinEvent = useCallback(async (eventId) => {
    if (!user?.id) return false;
    
    try {
      // API POST /application - tạo đơn ứng tuyển
      const res = await api.post(`/application`, { 
        eventId: eventId,
        volunteerId: user.volunteer.id 
      });
      
      // Cập nhật userJoinedEvents map
      setUserJoinedEvents(prev => ({
        ...prev,
        [eventId]: true
      }));

      // Cập nhật count trong events (tùy chọn - nếu backend trả về)
      if (res.data) {
        setEvents((prev) => 
          prev.map((e) => 
            e.id === eventId 
              ? { ...e, applicationsCount: (e.applicationsCount || 0) + 1 }
              : e
          )
        );
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi tham gia sự kiện:", error);
      return false;
    }
  }, [user?.id]);

  // 🔹 Hành động: Rời sự kiện (hủy application)
  const leaveEvent = useCallback(async (eventId) => {
    if (!user?.id) return false;

    try {
      // Tìm application ID của user cho event này
      const appRes = await api.get(`/application/volunteer/${user.id}`);
      const application = appRes.data.find(app => app.eventId === eventId);
      
      if (!application) {
        console.error("Không tìm thấy application");
        return false;
      }

      // API PATCH /application/:id/cancel - hủy đơn
      await api.patch(`/application/${application.id}/cancel`);

      // Cập nhật userJoinedEvents map
      setUserJoinedEvents(prev => {
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      });

      // Giảm count trong events
      setEvents((prev) => 
        prev.map((e) => 
          e.id === eventId 
            ? { ...e, applicationsCount: Math.max((e.applicationsCount || 1) - 1, 0) }
            : e
        )
      );

      return true;
    } catch (error) {
      console.error("Lỗi khi rời sự kiện:", error);
      return false;
    }
  }, [user?.id]);

  // 🔹 (Tùy chọn) Listener real-time nếu có sự kiện mới được tạo
  useEffect(() => {
    const onEventCreated = (e) => {
      const createdEvent = e.detail;
      if (!createdEvent) return;
      
      setOriginalEvents((prev) => [createdEvent, ...prev]);
      setEvents((prev) => {
        const newEvents = [createdEvent, ...prev];
        return sortEvents(newEvents, sortBy);
      });
    };
    
    window.addEventListener("event:created", onEventCreated);
    return () => window.removeEventListener("event:created", onEventCreated);
  }, [sortBy, sortEvents]);

  const value = {
    events,
    loading,
    sortBy,
    changeSortBy,
    joinEvent,
    leaveEvent,
    userJoinedEvents, // Nếu bạn muốn quản lý map riêng
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents() phải được dùng bên trong <EventsProvider>");
  }
  return context;
};