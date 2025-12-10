import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber, message, AutoComplete, Upload, Button } from "antd";
import { EnvironmentOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function EditEventModal({ visible, onClose, event, onSuccess }) {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewLocation, setPreviewLocation] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const searchTimeoutRef = useRef(null);

  const [form] = Form.useForm();

  const categoryOptions = [
    { value: 1, label: "Môi trường" },
    { value: 2, label: "Giáo dục" },
    { value: 3, label: "Cộng đồng" },
    { value: 4, label: "Y tế" },
    { value: 5, label: "Văn hóa - Nghệ thuật" },
  ];

  // Populate form khi event thay đổi
  useEffect(() => {
    if (event && visible) {
      form.setFieldsValue({
        title: event.title || event.raw?.title,
        description: event.raw?.description || "",
        location: event.location || event.raw?.location,
        imgUrl: event.raw?.imgUrl || "",
        timeRange: [
          event.startTime ? dayjs(event.startTime) : null,
          event.endTime ? dayjs(event.endTime) : null,
        ],
        capacity: event.raw?.capacity || 0,
      });
      setPreviewImage(event.raw?.imgUrl || "");
      setPreviewLocation(event.location || "");
    }
  }, [event, visible, form]);

  // Tìm kiếm địa điểm
  const handleLocationSearch = async (value) => {
    if (!value) {
      setLocationOptions([]);
      return;
    }
    setSearchingLocation(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5&countrycodes=vn`
        );
        const data = await response.json();
        const options = data.map((item) => ({
          value: item.display_name,
          lat: item.lat,
          lon: item.lon,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
              <EnvironmentOutlined style={{ marginRight: 8, color: '#FA541C', flexShrink: 0 }} />
              <span style={{ whiteSpace: 'normal', fontSize: '13px' }}>{item.display_name}</span>
            </div>
          ),
        }));
        setLocationOptions(options);
      } catch (error) {
        console.error("Lỗi tìm kiếm địa điểm:", error);
      } finally {
        setSearchingLocation(false);
      }
    }, 500);
  };

  const handleLocationSelect = (value, option) => {
    form.setFieldsValue({ location: value });
    if (option.lat && option.lon) {
      setPreviewLocation(`${option.lat},${option.lon}`);
    } else {
      setPreviewLocation(value);
    }
  };

  const handleImageChange = (e) => {
    setPreviewImage(e.target.value);
  };

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const userId = user.id || user._id;
      formData.append('userId', userId);

      const response = await api.post("/file/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data) {
        const url = response.data.file?.url || response.data.url;
        if (url) {
          form.setFieldsValue({ imgUrl: url });
          setPreviewImage(url);
          message.success('Tải ảnh lên thành công');
        }
      }
    } catch (error) {
      console.error("Lỗi upload:", error);
      message.error('Không thể tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  // Submit form - chỉ gửi các field đã thay đổi (theo validator updateEvent)
  const handleSubmit = async (values) => {
    if (!event?.id) {
      return message.error("Không tìm thấy ID sự kiện!");
    }

    // Chỉ gửi các trường cho phép update theo validator
    const payload = {};
    
    if (values.title) payload.title = values.title;
    if (values.description !== undefined) payload.description = values.description;
    if (values.location) payload.location = values.location;
    if (values.imgUrl !== undefined) payload.imgUrl = values.imgUrl;
    if (values.capacity) payload.capacity = values.capacity;
    
    if (values.timeRange && values.timeRange[0] && values.timeRange[1]) {
      payload.startTime = values.timeRange[0].toISOString();
      payload.endTime = values.timeRange[1].toISOString();
    }

    console.log("Updating Event Payload:", payload);

    try {
      setLoading(true);
      await api.put(`/event/${event.id}`, payload);

      message.success("Cập nhật sự kiện thành công!");
      form.resetFields();
      setPreviewLocation("");
      setPreviewImage("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating event:", err);
      message.error(err?.response?.data?.message || "Không thể cập nhật sự kiện");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Sửa sự kiện"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Cập nhật"
      confirmLoading={loading}
      destroyOnClose={true}
      style={{ top: 20 }}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Cột trái */}
          <div style={{ flex: 1 }}>
            <Form.Item
              label="Tên sự kiện"
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập tên sự kiện" },
                { min: 3, message: "Tên sự kiện phải có ít nhất 3 ký tự" },
                { max: 255, message: "Tên sự kiện không được quá 255 ký tự" }
              ]}
            >
              <Input placeholder="VD: Ngày hội hiến máu tình nguyện" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
            >
              <TextArea rows={4} placeholder="Mô tả chi tiết sự kiện..." />
            </Form.Item>
          </div>

          {/* Cột phải: Ảnh preview */}
          <div style={{ width: '200px' }}>
            <Form.Item label="Ảnh bìa" name="imgUrl">
              <Input 
                placeholder="Nhập URL ảnh" 
                onChange={handleImageChange}
              />
            </Form.Item>

            {previewImage && (
              <div style={{ 
                width: '100%', 
                height: '150px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '8px', 
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'; }}
                />
              </div>
            )}

            <Upload
              beforeUpload={(file) => { handleUpload(file); return false; }}
              showUploadList={false}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={uploading}
                block
              >
                {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
              </Button>
            </Upload>
          </div>
        </div>

        <Form.Item
          label="Địa điểm"
          name="location"
          rules={[
            { required: true, message: "Vui lòng chọn địa điểm" },
            { min: 3, message: "Địa điểm phải có ít nhất 3 ký tự" },
            { max: 255, message: "Địa điểm không được quá 255 ký tự" }
          ]}
        >
          <AutoComplete
            options={locationOptions}
            onSearch={handleLocationSearch}
            onSelect={handleLocationSelect}
            placeholder="Tìm kiếm địa điểm..."
            notFoundContent={searchingLocation ? "Đang tìm..." : "Không tìm thấy"}
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: '20px' }}>
          <Form.Item
            label="Thời gian diễn ra"
            name="timeRange"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <RangePicker 
              showTime 
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng người tham gia"
            name="capacity"
            style={{ flex: 0.5 }}
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              { type: 'number', min: 1, message: "Số lượng phải lớn hơn 0" }
            ]}
          >
            <InputNumber min={1} placeholder="50" style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
