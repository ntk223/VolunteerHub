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
        // Gọi API lấy tất cả sự kiện (Backend nên filter chỉ trả về các sự kiện status='open' hoặc 'approved')
        const res = await api.get(`/event`);
        
        // Nếu backend chưa filter, ta có thể filter phía client (tùy chọn)
        // const approvedEvents = res.data.filter(e => e.status === 'open');
        const approvedEvents = res.data;

        setOriginalEvents(approvedEvents);
        setEvents(approvedEvents);
      } catch (err) {
        console.error("Lỗi tải sự kiện:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]); // Reload khi user đổi (để cập nhật trạng thái join nếu cần)

  // 🔹 Kiểm tra danh sách các sự kiện mà user hiện tại đã tham gia
  // (Nếu API event trả về mảng participants chứa ID user thì không cần cái này, 
  // nhưng nếu participants chỉ là con số count thì cần gọi API riêng này)
  useEffect(() => {
    const fetchUserJoinedStatus = async () => {
      if (!user?.id) return;
      try  {
        const res = await api.get(`/event/${user.id}/joined`);
        const joinedEventIds = res.data; // Giả định API trả về mảng ID sự kiện đã tham gia

        // Chuyển thành object map cho nhanh trong việc kiểm tra
        const joinedMap = {};
        joinedEventIds.forEach(eventId => {
          joinedMap[eventId] = true;
        });
        setUserJoinedEvents(joinedMap);
      } catch (error) {
        console.error("Lỗi tải trạng thái tham gia sự kiện của user:", error);
      }
      // Logic này giả định dựa trên dữ liệu event có sẵn trường participants (array id)
      // Nếu không, bạn cần gọi API: await api.get(`/event/user/${user.id}/joined`);
    };
    fetchUserJoinedStatus();
  }, [user?.id]);

  // 🔹 Sắp xếp sự kiện
  const sortEvents = useCallback((eventsList, sortType) => {
    const sorted = [...eventsList];
    
    if (sortType === 'popularity') {
      return sorted.sort((a, b) => {
        // Sắp xếp theo số lượng người tham gia giảm dần
        const countA = Array.isArray(a.participants) ? a.participants.length : (a.participantsCount || 0);
        const countB = Array.isArray(b.participants) ? b.participants.length : (b.participantsCount || 0);
        return countB - countA;
      });
    } else {
      // 'upcoming' hoặc mặc định: Sắp xếp theo ngày diễn ra (Mới nhất/Gần nhất lên đầu)
      return sorted.sort((a, b) => {
        return new Date(a.date) - new Date(b.date); // Ngày gần nhất lên trước
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

  // 🔹 Hành động: Tham gia sự kiện
  const joinEvent = useCallback(async (eventId) => {
    if (!user?.id) return;
    
    try {
      // Gọi API Join
      // Giả định API trả về danh sách participants mới hoặc object event đã update
      const res = await api.post(`/event/${eventId}/join`, { userId: user.id });
      
      // Cập nhật State Optimistic hoặc dựa trên Response
      setEvents((prev) => {
        const updatedEvents = prev.map((e) => {
          if (e.id === eventId) {
            // Nếu API trả về list participants mới
            const newParticipants = res.data.participants || [...(e.participants || []), user.id];
            return { ...e, participants: newParticipants };
          }
          return e;
        });
        // Đồng bộ originalEvents để khi sort không bị mất dữ liệu mới
        setOriginalEvents(updatedEvents);
        return updatedEvents;
      });

      return true; // Trả về true để component biết là thành công
    } catch (error) {
      console.error("Lỗi khi tham gia sự kiện:", error);
      return false;
    }
  }, [user?.id]);

  // 🔹 Hành động: Rời sự kiện
  const leaveEvent = useCallback(async (eventId) => {
    if (!user?.id) return;

    try {
      // Gọi API Leave
      await api.post(`/event/user/${user.id}/event/${eventId}/leave`, { userId: user.id }); // Hoặc dùng method DELETE

      setEvents((prev) => {
        const updatedEvents = prev.map((e) => {
          if (e.id === eventId) {
            // Lọc bỏ user ID khỏi mảng participants
            const newParticipants = (e.participants || []).filter(uid => uid !== user.id);
            return { ...e, participants: newParticipants };
          }
          return e;
        });
        setOriginalEvents(updatedEvents);
        return updatedEvents;
      });

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