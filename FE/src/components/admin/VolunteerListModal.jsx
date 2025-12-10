import { Modal, Table, Tag, Button, Space, Typography, Empty, message } from 'antd';
import { DownloadOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;

const VolunteerListModal = ({ visible, onClose, event }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && event?.id) {
      fetchVolunteers();
    }
  }, [visible, event]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/application/event/${event.id}`);
      console.log('Raw API response:', response.data);
      
      // Không filter, lấy tất cả applications
      const allApplications = response.data || [];
      console.log('All applications:', allApplications);
      console.log('Applications count:', allApplications.length);
      
      setVolunteers(allApplications);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      message.error('Không thể tải danh sách tình nguyện viên');
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (volunteers.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    const volunteerData = volunteers.map((app, index) => ({
      'STT': index + 1,
      'Họ và tên': app.volunteer?.user?.name || 'N/A',
      'Email': app.volunteer?.user?.email || 'N/A',
      'Số điện thoại': app.volunteer?.user?.phone || 'N/A',
      'Ngày đăng ký': app.appliedAt ? new Date(app.appliedAt).toLocaleString('vi-VN') : 'N/A',
      'Trạng thái': app.status === 'approved' ? 'Đã duyệt' : 
                    app.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt',
    }));
    console.log('Volunteer data for Excel:', volunteerData);
    const worksheet = XLSX.utils.json_to_sheet(volunteerData);
    
    // Tự động điều chỉnh độ rộng cột
    const maxWidth = volunteerData.reduce((w, r) => Math.max(w, r['Họ và tên']?.length || 0), 10);
    worksheet['!cols'] = [
      { wch: 5 },  // STT
      { wch: Math.max(15, maxWidth) },  // Họ và tên
      { wch: 25 }, // Email
      { wch: 15 }, // Số điện thoại
      { wch: 20 }, // Ngày đăng ký
      { wch: 12 }, // Trạng thái
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách tình nguyện viên');

    // Thêm sheet thông tin sự kiện
    const eventInfo = [
      ['Tên sự kiện:', event.title],
      ['Địa điểm:', event.location || 'N/A'],
      ['Thời gian:', `${new Date(event.startTime).toLocaleString('vi-VN')} - ${new Date(event.endTime).toLocaleString('vi-VN')}`],
      ['Số lượng tình nguyện viên:', volunteers.length],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
    ];
    const eventSheet = XLSX.utils.aoa_to_sheet(eventInfo);
    XLSX.utils.book_append_sheet(workbook, eventSheet, 'Thông tin sự kiện');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const fileName = `Danh_sach_tinh_nguyen_vien_${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;
    saveAs(data, fileName);
    message.success('Xuất file Excel thành công!');
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ và tên',
      key: 'name',
      width: 180,
      render: (_, record) => (
        <Text strong>{record.volunteer?.user?.name || 'N/A'}</Text>
      ),
    },
    {
      title: 'Email',
      key: 'email',
      width: 220,
      render: (_, record) => (
        <Space size={4}>
          <MailOutlined style={{ color: '#1890ff' }} />
          <Text copyable>{record.volunteer?.user?.email || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      width: 140,
      render: (_, record) => (
        <Space size={4}>
          <PhoneOutlined style={{ color: '#52c41a' }} />
          <Text copyable>{record.volunteer?.user?.phone || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      width: 160,
      sorter: (a, b) => new Date(a.appliedAt) - new Date(b.appliedAt),
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const config = {
          approved: { color: 'green', text: 'Đã duyệt' },
          rejected: { color: 'red', text: 'Từ chối' },
          pending: { color: 'orange', text: 'Chờ duyệt' },
          attended : { color: 'blue', text: 'Đã tham gia' },
        };
        const { color, text } = config[status] || { color: 'default', text: 'N/A' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <Modal
      title={
        <Space direction="vertical" size={0}>
          <Title level={4} style={{ margin: 0 }}>
            👥 Danh sách tình nguyện viên
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {event?.title}
          </Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="export"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
          disabled={volunteers.length === 0}
        >
          Xuất Excel
        </Button>,
      ]}
      style={{ top: 20 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Thông tin tóm tắt */}
        <div style={{
          background: '#f0f2f5',
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Tổng số đăng ký</Text>
            <Title level={3} style={{ margin: '4px 0 0 0', color: '#1890ff' }}>
              {volunteers.length}
            </Title>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Địa điểm</Text>
            <Title level={5} style={{ margin: '4px 0 0 0' }}>
              {event?.location || 'N/A'}
            </Title>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Thời gian</Text>
            <Title level={5} style={{ margin: '4px 0 0 0' }}>
              {event?.startTime ? new Date(event.startTime).toLocaleDateString('vi-VN') : 'N/A'}
            </Title>
          </div>
        </div>

        {/* Bảng danh sách */}
        <Table
          columns={columns}
          dataSource={volunteers}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tình nguyện viên`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Chưa có tình nguyện viên nào đăng ký"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          scroll={{ y: 400 }}
        />
      </Space>
    </Modal>
  );
};

export default VolunteerListModal;
