import { Table, Tag, Button, message, Select, Space, Modal, Card, Tooltip, Typography } from "antd";
import { DownloadOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { exportEventsToExcel } from "../../utils/excelExport";
import EventModal from "../post/EventModal";
import EventDetailModal from "../createEvent/EventDetailModal";
const { Title, Text } = Typography;

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

  // Xử lý hành động
  const handleApprove = async (record) => {
    try {
      await changeEventApprovalStatus(record.id, "approved");
      message.success(`Đã duyệt "${record.title}"`);
    } catch {
      message.error("Không thể duyệt sự kiện.");
    }
  };

  const handleReject = async (record) => {
    try {
      await changeEventApprovalStatus(record.id, "rejected");
      message.info(`Đã từ chối "${record.title}"`);
    } catch {
      message.error("Không thể từ chối sự kiện.");
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xóa sự kiện?",
      content: `Sự kiện "${record.title}" sẽ bị xóa vĩnh viễn.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteEvent(record.id);
          message.success("Đã xóa sự kiện");
        } catch {
          message.error("Lỗi khi xóa sự kiện");
        }
      },
    });
  };

  const eventColumns = [
    { 
      title: "Tên sự kiện", 
      dataIndex: "title", 
      key: "title", 
      fixed: 'left', // Cố định cột này bên trái
      width: 200,    // Đặt chiều rộng cố định
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: "Người tạo",
      dataIndex: ["manager", "user", "name"],
      key: "manager",
      width: 150,
      render: (name) => <span style={{ color: '#555' }}>{name || "—"}</span>,
    },
    {
      title: "Danh mục", 
      dataIndex: ["category", "name"], 
      key: "category",
      width: 130,
      render: (name) => name ? <Tag color="geekblue">{name}</Tag> : "—",
    },
    {
      title: "Thời gian",
      key: "time",
      width: 220,
      render: (_, record) => {
        const { startTime, endTime } = record;
        if (!startTime || !endTime) return "—";
        const start = new Date(startTime);
        const end = new Date(endTime);
        const sameDay = start.toLocaleDateString("vi-VN") === end.toLocaleDateString("vi-VN");

        return (
          <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
            {sameDay ? (
               <>
                 <div>{start.toLocaleDateString("vi-VN")}</div>
                 <div style={{ color: '#888' }}>
                   {start.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                 </div>
               </>
            ) : (
               <span>{start.toLocaleDateString("vi-VN")} - {end.toLocaleDateString("vi-VN")}</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: 200,
      ellipsis: { showTitle: false }, // Cắt bớt nếu quá dài
      render: (loc) => <Tooltip placement="topLeft" title={loc}>{loc || "—"}</Tooltip>,
    },
    {
      title: "Trạng thái",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      width: 120,
      render: (s) => {
        let color = "default";
        let text = "N/A";
        switch (s) {
          case "pending": color = "orange"; text = "Chờ duyệt"; break;
          case "approved": color = "green"; text = "Đã duyệt"; break;
          case "rejected": color = "red"; text = "Từ chối"; break;
          default: break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: 'right', // Cố định cột này bên phải
      width: 160,
      render: (_, record) => (
        <Space size="small" direction="vertical" style={{ width: '100%' }}>
          {record.approvalStatus === "pending" ? (
            <>
              <div style={{ display: 'flex', gap: 4 }}>
                <Button 
                  type="primary" 
                  // icon={<CheckOutlined />} 
                  size="small"
                  style={{ flex: 1 }}
                  onClick={() => handleApprove(record)} 
                >
                  Duyệt
                </Button>
                <Button 
                  danger
                  // icon={<CloseOutlined />} 
                  size="small"
                  style={{ flex: 1 }}
                  onClick={() => handleReject(record)} 
                >
                  Từ chối
                </Button>
              </div>
              <Button 
                type="link"
                icon={<EyeOutlined />} 
                size="small"
                block
                onClick={() => handleViewEvent(record)} 
              >
                Xem chi tiết
              </Button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 4 }}>
              <Button 
                type="link"
                icon={<EyeOutlined />} 
                size="small"
                style={{ flex: 1 }}
                onClick={() => handleViewEvent(record)} 
              >
                Xem
              </Button>
              <Button 
                danger
                type="link"
                icon={<DeleteOutlined />} 
                size="small"
                style={{ flex: 1 }}
                onClick={() => handleDelete(record)} 
              >
                Xóa
              </Button>
            </div>
          )}
        </Space>
      ),
    }
  ];

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0, marginBottom: 4 }}>📅 Danh sách sự kiện</Title>
          <Text type="secondary">Quản lý và kiểm duyệt sự kiện tình nguyện</Text>
        </div>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          size="large"
          onClick={() => {
            try {
              exportEventsToExcel(filteredEvents);
              message.success('Xuất file thành công');
            } catch {
              message.error('Lỗi xuất file');
            }
          }}
        >
          Xuất Excel
        </Button>
      </div>
      
      {/* Thanh lọc trạng thái */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Text strong>Lọc trạng thái:</Text>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
        </Space>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        dataSource={filteredEvents}
        columns={eventColumns}
        rowKey={(r) => r.id || r._id}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sự kiện`,
        }}
        scroll={{ x: 1200 }} 
      />

      {/* <EventModal
        event={selectedEvent}
        isModalVisible={isEventModalVisible}
        setIsModalVisible={setIsEventModalVisible}
      /> */}
      <EventDetailModal 
        visible={isEventModalVisible} 
        event={selectedEvent} 
        onClose={() => setIsEventModalVisible(false)} 
        isAdmin={true}
      />
    </div>
  );
};

export default EventManage;