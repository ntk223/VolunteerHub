import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, message, Typography, Spin, Card, Empty } from "antd";
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";

const { Text, Title } = Typography;

export default function ManageApplicationsPage() {
  const { user } = useAuth();
  console.log("Current user:", user);
  if (!user || user.role !== "volunteer") {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Empty description="Bạn không có quyền truy cập trang này" />
      </div>
    );
  }

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // strictly use volunteerId (not userId)
        const volunteerId = user.volunteerId ?? user.volunteer.id;
        if (!volunteerId) {
          message.error("Không tìm thấy volunteer ID");
          setApplications([]);
          return;
        }

        // use the route that exists: GET /application/volunteer/:volunteerId
        const res = await api.get(`/application/volunteer/${encodeURIComponent(volunteerId)}`);

        const list = Array.isArray(res.data) ? res.data : res.data.applications || [];
        const enriched = list
          .filter((app) => {
            // hide if is_cancelled is 1 or status is 'cancelled'
            const isCancelled = app.isCancelled === 1 || app.isCancelled === true || (app.status ?? "").toLowerCase() === "cancelled";
            return !isCancelled;
          })
          .map((app) => ({
            id: app.id ?? app.applicationId ?? app._id,
            eventId: app.eventId ?? app.event_id,
            event: app.event ?? null, // assume backend populated event
            status: app.status ?? app.state ?? "pending",
            appliedAt: app.appliedAt ?? app.applied_at,
            raw: app,
          }));

        setApplications(enriched);
      } catch (err) {
        console.error("fetch applications error", err);
        message.error("Không thể tải danh sách ứng tuyển");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleCancel = async (applicationId) => {
    try {
      await api.patch(`/application/${applicationId}/cancel`);
      message.success("Đã hủy ứng tuyển thành công");

      setLoading(true);
      const volunteerId = user.volunteerId ?? user.volunteer.id;
      const res = await api.get(`/application/volunteer/${volunteerId}`);
      
      const list = Array.isArray(res.data) ? res.data : res.data.applications || [];
      const enriched = list
        .filter((app) => {
          const isCancelled = app.isCancelled === true || app.isCancelled === 1;
          return !isCancelled;
        })
        .map((app) => ({
          id: app.id,
          eventId: app.eventId,
          event: app.event,
          status: app.status ?? "pending",
          appliedAt: app.createdAt || app.appliedAt,
          raw: app,
        }));

      setApplications(enriched);
      setLoading(false);

    } catch (err) {
      console.error("cancel error", err);
      message.error("Hủy ứng tuyển thất bại");
    }
  };

  // Hàm chuyển đổi status sang tiếng Việt
  const getStatusText = (status) => {
    const statusMap = {
      pending: "Đang chờ duyệt",
      approved: "Đã chấp nhận",
      rejected: "Đã từ chối",
      cancelled: "Đã hủy",
      attended: "Đã tham gia",
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "blue",
      accepted: "green",
      rejected: "red",
      cancelled: "orange",
      attended: "cyan",
    };
    return colorMap[status?.toLowerCase()] || "default";
  };

  const columns = [
    {
      title: "Sự kiện",
      dataIndex: "event",
      width: "40%",
      render: (ev, record) => {
        if (!ev) {
          return <Text type="secondary">Event ID: {record.eventId}</Text>;
        }
        
        const startTime = ev.startTime ? new Date(ev.startTime) : null;
        
        return (
          <Space direction="vertical" size={4}>
            <Text strong style={{ fontSize: 16 }}>{ev.title ?? ev.name ?? "Không có tên"}</Text>
            {ev.location && (
              <Text type="secondary">
                <EnvironmentOutlined /> {ev.location}
              </Text>
            )}
            {startTime && (
              <Text type="secondary">
                <CalendarOutlined /> {startTime.toLocaleDateString('vi-VN')} - {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Thời gian ứng tuyển",
      dataIndex: "appliedAt",
      width: "20%",
      render: (v) => {
        if (!v) return <Text type="secondary">-</Text>;
        const date = new Date(v);
        return (
          <Space direction="vertical" size={0}>
            <Text>{date.toLocaleDateString('vi-VN')}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined /> {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "20%",
      align: "center",
      render: (s) => (
        <Tag color={getStatusColor(s)} style={{ fontSize: 13, padding: '4px 12px' }}>
          {getStatusText(s)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      width: "20%",
      align: "center",
      render: (_, r) => {
        const status = (r.status ?? "").toLowerCase();
        if (status === "cancelled" || status === "rejected" || status === "attended") {
          return <Text type="secondary">-</Text>;
        }
        // else if (r.event.progressStatus !== "incomplete" ) {
        //   return <Text type="secondary">Không thể hủy ứng tuyển</Text>;
        // }
        return (
          <Button 
            size="small" 
            danger 
            onClick={() => handleCancel(r.id)}
            style={{ borderRadius: 6 }}
          >
            Hủy ứng tuyển
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Card 
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
            Đơn ứng tuyển của tôi
          </Title>
          <Text type="secondary">
            Quản lý các đơn ứng tuyển sự kiện tình nguyện của bạn
          </Text>
        </div>

        {loading && applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <Table
            rowKey="id"
            dataSource={applications}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} đơn ứng tuyển`,
              locale: { items_per_page: '/ trang' }
            }}
            locale={{
              emptyText: (
                <Empty 
                  description="Bạn chưa có đơn ứng tuyển nào"
                  style={{ padding: '40px 0' }}
                />
              )
            }}
            style={{ marginTop: 16 }}
          />
        )}
      </Card>
    </div>
  );
}