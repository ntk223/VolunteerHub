import { Table, Tag, Button, message, Select, Space, Modal } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { exportEventsToExcel } from "../../utils/excelExport";
import EventModal from "../post/EventModal";

const { Option } = Select;

const EventManage = ({ events, changeEventApprovalStatus, deleteEvent }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      return statusFilter === 'all' || event.approvalStatus === statusFilter;
    });
  }, [events, statusFilter]);

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setIsEventModalVisible(true);
  };
  const eventColumns = [
    { title: "Tên sự kiện", dataIndex: "title", key: "title" },
    {
      title: "Người tạo",
      dataIndex: ["manager", "user", "name"],
      key: "manager.user.name",
      render: (name) => <span>{name}</span>,
    },
    {
      title: "Danh mục", dataIndex: ["category", "name"], key: "category.name", render: (name) => <span>{name}</span>,
    },
    {
      title: "Thời gian diễn ra",
      key: "timeRange",
      render: (_, record) => {
        const { startTime, endTime } = record;
        if (!startTime || !endTime) return "—";

        const start = new Date(startTime);
        const end = new Date(endTime);

        const sameDay =
          start.toLocaleDateString("vi-VN") === end.toLocaleDateString("vi-VN");

        const startTimeStr = start.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTimeStr = end.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const startDateStr = start.toLocaleDateString("vi-VN");
        const endDateStr = end.toLocaleDateString("vi-VN");

        return sameDay
          ? `${startTimeStr} - ${endTimeStr}, ${startDateStr}`
          : `${startTimeStr}, ${startDateStr} - ${endTimeStr}, ${endDateStr}`;
      },
    },

    {
    title: "Địa điểm",
    dataIndex: "location",
    key: "location",
    render: (location) => <span>{location || "—"}</span>,
      },
    {
      title: "Trạng thái",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      render: (s) => (
        <Tag
          color={
            s === "pending"
              ? "orange"
              : s === "approved"
              ? "green"
              : s === "rejected"
              ? "red"
              : "default"
          }
        >
          {s === "pending"
            ? "Chờ duyệt"
            : s === "approved"
            ? "Đã duyệt"
            : s === "rejected"
            ? "Từ chối"
            : "Không xác định"}
        </Tag>

      ),
    },
    {
      title: "Tiến trình",
      dataIndex: "progressStatus",
      key: "progressStatus",
      render: (status) => <span>{status === 'completed' ? 'Hoàn thành' : status === 'incomplete' ? 'Chưa hoàn thành' : 'Đã hủy'}</span>,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => new Date(d).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {record.approvalStatus === "pending" && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await changeEventApprovalStatus(record.id, "approved");
                    message.success(`Đã duyệt "${record.title}"`);
                  } catch {
                    message.error("Không thể duyệt sự kiện.");
                  }
                }}
              >
                Duyệt
              </Button>

              <Button
                type="primary"
                danger
                onClick={async () => {
                  try {
                    await changeEventApprovalStatus(record.id, "rejected");
                    message.info(`Đã từ chối "${record.title}"`);
                  } catch {
                    message.error("Không thể từ chối sự kiện.");
                  }
                }}
              >
                Từ chối
              </Button>
            </div>
          )}

        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewEvent(record)}
          >
            Xem
          </Button>
          <Button
            danger
            style={{ width: "70px", textAlign: "center" }}
            onClick={async () => Modal.confirm({
              title: "Bạn có chắc muốn xóa sự kiện?",
              content: `Sự kiện: "${record.title}" sẽ bị xóa vĩnh viễn.`,
              okText: "Xóa",
              okType: "danger",
              cancelText: "Hủy",
              onOk: async () => {
                try {
                  await deleteEvent(record.id);
                  message.success(`Đã xóa sự kiện "${record.title}"`);
                } catch {
                  message.error("Không thể xóa sự kiện.");
                }
              },
            })
            }
          >
            Xóa
          </Button>
        </div>
        </div>
      ),
    }

  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <span>Lọc theo trạng thái duyệt:</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
        </Space>
        
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={() => {
            try {
              exportEventsToExcel(filteredEvents);
              message.success('Đã xuất danh sách sự kiện thành công!');
            } catch (error) {
              console.error(error);
              message.error('Lỗi khi xuất file Excel');
            }
          }}
        >
          Xuất Excel
        </Button>
      </div>
      
      <Table
        dataSource={filteredEvents}
        columns={eventColumns}
        rowKey={(r) => r.id || r._id}
        pagination={{ pageSize: 5 }}
      />

      <EventModal
        event={selectedEvent}
        isModalVisible={isEventModalVisible}
        setIsModalVisible={setIsEventModalVisible}
      />
    </div>
  );
};

export default EventManage;
