import React, { useState, useMemo } from "react";
import { Spin, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EventDetailModal from "../../components/createEvent/EventDetailModal";
import EventFilters from "../../components/event/EventFilters";
import EventList from "../../components/event/EventList";
import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents";

const EventsPage = () => {
  const { user } = useAuth();
  const { events, loading, joinEvent, leaveEvent } = useEvents();

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  // Filter và sort events
  const filteredAndSortedEvents = useMemo(() => {
    // Filter approved events
    let result = events.filter((event) => event.approvalStatus === "approved");

    // Filter by search text
    if (searchText) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchText.toLowerCase()) ||
          event.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter === "open") {
      result = result.filter((event) => event.progressStatus === "incomplete");
    } else if (statusFilter === "closed") {
      result = result.filter((event) => event.progressStatus !== "incomplete");
    }

    // Sort events
    result.sort((a, b) => {
      switch (sortBy) {
        case "hot":
          // Sắp xếp theo postsCount (sự kiện hot)
          return (b.postsCount || 0) - (a.postsCount || 0);
        
        case "participants":
          // Sắp xếp theo số người tham gia
          return (b.currentApplied || 0) - (a.currentApplied || 0);
        
        case "startTime":
          // Sắp xếp theo thời gian sắp diễn ra
          const dateA = new Date(a.startTime || a.date);
          const dateB = new Date(b.startTime || b.date);
          return dateA - dateB;
        
        case "newest":
        default:
          // Sắp xếp theo mới nhất (createdAt)
          const createdA = new Date(a.createdAt);
          const createdB = new Date(b.createdAt);
          return createdB - createdA;
      }
    });

    return result;
  }, [events, searchText, statusFilter, sortBy]);

  const handleModalAction = async (eventId) => {
    const currentEvent = events.find(e => e.id === eventId);
    const isJoined = currentEvent?.participants?.includes(user?.id ?? user?._id);
    
    if (isJoined) {
        await leaveEvent(eventId);
    } else {
        await joinEvent(eventId);
    }
  };

  const tabItems = [
    { key: "all", label: "Tất cả sự kiện" },
    { key: "open", label: "Đang mở đăng ký" },
    { key: "closed", label: "Đã kết thúc" },
  ];

  if (loading && events.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} tip="Đang tải sự kiện..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <EventFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Tabs
        defaultActiveKey="all"
        items={tabItems}
        onChange={(key) => setStatusFilter(key)}
        style={{ marginBottom: 24 }}
      />

      <EventList
        events={filteredAndSortedEvents}
        userId={user?.id ?? user?._id}
        onCardClick={setSelectedEventId}
      />

      <EventDetailModal 
        visible={!!selectedEvent} 
        event={selectedEvent} 
        onClose={() => setSelectedEventId(null)}
        onJoinUpdate={handleModalAction} 
      />
    </div>
  );
};

export default EventsPage;