import React, { useEffect, useState, useMemo } from "react";
import { message, Card, Typography, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";
import UnauthorizePage from "../UnauthorizePage/UnauthorizePage";
import EventTable from "../../components/manageEvent/EventTable";
import ApplicantTable from "../../components/manageEvent/ApplicantTable";
import EventSearchBar from "../../components/manageEvent/EventSearchBar";
import EditEventModal from "../../components/manageEvent/EditEventModal";
import EventDetailModal from "../../components/createEvent/EventDetailModal";

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function ManageEventPage() {
  const { user } = useAuth();
  if (!user || user.role !== "manager") return <UnauthorizePage />;

  const managerUserId = user?.id ?? user?._id ?? null;
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [appsMap, setAppsMap] = useState({});
  const [searchText, setSearchText] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // Hàm cập nhật trạng thái tiến trình
  const updateProgressStatus = async (eventId, newStatus) => {
    try {
      await api.patch(`/event/progress-status/${eventId}`, {
        progressStatus: newStatus,
      });

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId ? { ...ev, progressStatus: newStatus } : ev
        )
      );

      message.success("Cập nhật trạng thái tiến trình thành công!");
    } catch (err) {
      message.error("Chỉ có thể cập nhật tiến trình đã được duyệt.");
      console.error(err);
    }
  };

  // Hàm mở modal xem event
  const handleViewEvent = (event) => {
    setViewingEvent(event.raw);
    setIsViewModalVisible(true);
  };

  // Hàm mở modal sửa event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEditModalVisible(true);
  };

  // Hàm xóa event
  const handleDeleteEvent = async (eventId) => {
    try {
      await api.delete(`/event/user/${user.id}/event/${eventId}`);
      message.success("Xóa sự kiện thành công!");
      
      // Refresh danh sách events
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    } catch (err) {
      console.error("Delete event error:", err);
      message.error(err?.response?.data?.message || "Không thể xóa sự kiện");
    }
  };

  // Callback sau khi sửa thành công
  const handleEditSuccess = () => {
    // Refresh lại danh sách events
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        let res = null;
        if (managerUserId) {
          try {
            res = await api.get(`/event/manager/${managerUserId}`);
          } catch (err) {
            console.warn("Lỗi lấy sự kiện manager, thử lấy tất cả");
          }
        }
        if (!res) res = await api.get("/event");

        let list = Array.isArray(res.data) ? res.data : [];

        list = list.map((ev) => ({
          id: ev.eventId ?? ev.id,
          title: ev.title ?? "Không có tiêu đề",
          startTime: ev.startTime,
          endTime: ev.endTime,
          location: ev.location ?? "Chưa xác định",
          approvalStatus: ev.approvalStatus,
          progressStatus: ev.progressStatus ?? "in incomplete",
          createdAt: ev.createdAt,
          raw: ev,
        }));

        setEvents(list);

        // Fetch applications cho tất cả events
        list.forEach((event) => {
          fetchApplicationsForEvent(event.id);
        });
      } catch (err) {
        message.error("Không thể tải danh sách sự kiện");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        let res = null;
        if (managerUserId) {
          try {
            res = await api.get(`/event/manager/${managerUserId}`);
          } catch (err) {
            console.warn("Lỗi lấy sự kiện manager, thử lấy tất cả");
          }
        }
        if (!res) res = await api.get("/event");

        let list = Array.isArray(res.data) ? res.data : [];

        list = list.map((ev) => ({
          id: ev.eventId ?? ev.id,
          title: ev.title ?? "Không có tiêu đề",
          startTime: ev.startTime,
          endTime: ev.endTime,
          location: ev.location ?? "Chưa xác định",
          approvalStatus: ev.approvalStatus,
          progressStatus: ev.progressStatus ?? "in incomplete",
          createdAt: ev.createdAt,
          raw: ev,
        }));

        setEvents(list);

        // Fetch applications cho tất cả events ngay từ đầu
        list.forEach((event) => {
          fetchApplicationsForEvent(event.id);
        });
      } catch (err) {
        message.error("Không thể tải danh sách sự kiện");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [managerUserId]);

  const filteredAndSearchedEvents = useMemo(() => {
    let filtered = events;
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = events.filter((event) => {
        return (
          event.title.toLowerCase().includes(lowerSearch) ||
          (event.location &&
            event.location.toLowerCase().includes(lowerSearch)) ||
          event.approvalStatus.toLowerCase().includes(lowerSearch) ||
          event.progressStatus.toLowerCase().includes(lowerSearch) ||
          (event.startTime &&
            new Date(event.startTime)
              .toLocaleString()
              .toLowerCase()
              .includes(lowerSearch)) ||
          (event.endTime &&
            new Date(event.endTime)
              .toLocaleString()
              .toLowerCase()
              .includes(lowerSearch)) ||
          (event.createdAt &&
            new Date(event.createdAt)
              .toLocaleString()
              .toLowerCase()
              .includes(lowerSearch))
        );
      });
    }
    return filtered;
  }, [events, searchText]);

  const fetchApplicationsForEvent = async (eventId) => {
    setAppsMap((m) => ({ ...m, [eventId]: { loading: true, list: [] } }));
    try {
      const res = await api.get(`/application/event/${eventId}`);
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.applications)
        ? res.data.applications
        : [];

      const enriched = list.map((app) => {
        const volunteer = app.volunteer ?? app.Volunteer ?? null;
        const volunteerUser =
          volunteer?.user ?? volunteer?.User ?? app.user ?? null;

        const name =
          volunteerUser?.name ||
          volunteerUser?.fullName ||
          volunteer?.fullName ||
          volunteer?.name ||
          `Volunteer #${app.volunteerId}`;

        const email = volunteerUser?.email || volunteer?.email || null;
        const avatar =
          volunteerUser.avatarUrl ||
          null;

        return {
          id: app.id ?? app.applicationId,
          eventId: app.eventId,
          volunteerId: app.volunteerId,
          status: app.status,
          appliedAt: app.appliedAt,
          user: { name, email, avatarUrl: avatar },
          raw: app,
        };
      });

      setAppsMap((m) => ({
        ...m,
        [eventId]: { loading: false, list: enriched },
      }));
    } catch (err) {
      setAppsMap((m) => ({ ...m, [eventId]: { loading: false, list: [] } }));
      message.error("Không thể tải danh sách ứng viên");
    }
  };

  const changeApplicationStatus = async (applicationId, newStatus, eventId) => {
    try {
      await api.patch(`/application/${applicationId}`, { status: newStatus });
      message.success("Cập nhật trạng thái ứng viên thành công");
      fetchApplicationsForEvent(eventId);
    } catch (err) {
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const handleExpandEvent = (expanded, record) => {
    if (expanded && !appsMap[record.id]) {
      fetchApplicationsForEvent(record.id);
    }
  };

  const renderExpandedRow = (record) => {
    const eventId = record.id;
    const state = appsMap[eventId] ?? { loading: false, list: [] };

    return (
      <ApplicantTable
        eventId={eventId}
        applicants={state.list}
        loading={state.loading}
        onChangeStatus={changeApplicationStatus}
        onReload={() => fetchApplicationsForEvent(eventId)}
      />
    );
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1600, margin: "0 auto" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
            Quản lý sự kiện
          </Title>
          <Text type="secondary">
            Quản lý sự kiện và duyệt đơn ứng tuyển của tình nguyện viên
          </Text>
        </div>

        <EventSearchBar
          value={searchText}
          onChange={setSearchText}
          onSearch={setSearchText}
        />

        <EventTable
          events={filteredAndSearchedEvents}
          loading={loadingEvents}
          appsMap={appsMap}
          onUpdateProgressStatus={updateProgressStatus}
          onViewEvent={handleViewEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          expandedRowRender={renderExpandedRow}
          onExpand={handleExpandEvent}
        />
      </Card>

      <EditEventModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSuccess={handleEditSuccess}
      />

      <EventDetailModal
        visible={isViewModalVisible}
        event={viewingEvent}
        onClose={() => {
          setIsViewModalVisible(false);
          setViewingEvent(null);
        }}
        onJoinUpdate={() => {}}
      />
    </div>
  );
}