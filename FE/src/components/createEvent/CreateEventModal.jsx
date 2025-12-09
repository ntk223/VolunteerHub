import React, { useState, useRef } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber, message, AutoComplete, Spin, Image, Upload, Button } from "antd";
import { EnvironmentOutlined, PictureOutlined, UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;

export default function CreateEventModal({ visible, onClose }) {
  const { user } = useAuth();
  
  // Chỉ cho phép manager truy cập
  if (user.role !== "manager") {
    return null;
  }
  const managerId = user.manager ? user.manager.id : user.id; // Fallback nếu user structure khác
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // State loading cho việc upload ảnh
  const [previewLocation, setPreviewLocation] = useState(""); 
  
  // 1. State lưu URL ảnh để preview
  const [previewImage, setPreviewImage] = useState(""); 
  
  // State cho tìm kiếm địa điểm
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

  // --- HÀM TÌM KIẾM ĐỊA ĐIỂM ---
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

  // 2. Xử lý khi người dùng nhập URL ảnh thủ công
  const handleImageChange = (e) => {
    setPreviewImage(e.target.value);
  };

  // 3. Xử lý Upload ảnh từ máy tính (SỬA LẠI userId)
  const handleUpload = async (file) => {
    try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        // SỬA: Dùng user.id (ID đăng nhập) thay vì managerId để tránh lỗi Backend tìm không thấy User
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
        message.error('Lỗi Server (500): Không thể tải ảnh. Vui lòng kiểm tra lại server.');
    } finally {
        setUploading(false);
    }
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (values) => {
    if (!managerId) {
      return message.error("Không thể xác định managerId!");
    }

    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      imgUrl: values.imgUrl,      // camelCase
      startTime: values.timeRange[0].toISOString(), // camelCase
      endTime: values.timeRange[1].toISOString(),   // camelCase
      categoryId: values.categoryId,  // camelCase
      capacity: values.capacity,
      managerId: managerId,           // camelCase
    };

    console.log("Submitting Event Payload:", payload);

    try {
      setLoading(true);
      await api.post("/event", payload);

      message.success("Tạo sự kiện thành công! Hãy chờ phê duyệt.");
      form.resetFields();
      setPreviewLocation(""); 
      setPreviewImage(""); 
      onClose();
    } catch (err) {
      console.error("Error creating event:", err);
      if (err.response && err.response.data) {
        console.error("Backend Error Details:", err.response.data);
      }
      message.error(err?.response?.data?.message || "Không thể tạo sự kiện");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo sự kiện mới"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Tạo sự kiện"
      confirmLoading={loading}
      destroyOnClose={true} // Sửa destroyOnHidden thành destroyOnClose chuẩn Antd
      style={{ top: 20 }}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* Cột trái: Thông tin cơ bản */}
            <div style={{ flex: 1 }}>
                <Form.Item
                    label="Tên sự kiện"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập tên sự kiện" }]}
                >
                    <Input placeholder="VD: Ngày hội hiến máu tình nguyện" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                >
                    <TextArea rows={4} placeholder="Mô tả chi tiết sự kiện..." />
                </Form.Item>
            </div>

            {/* Cột phải: Ảnh preview & Upload */}
            <div style={{ width: '200px' }}>
                <Form.Item
                    label="Ảnh bìa"
                    name="imgUrl"
                    rules={[
                        { required: true, message: "Vui lòng tải hoặc nhập link ảnh" },
                        { type: 'url', message: "Link ảnh không hợp lệ" }
                    ]}
                >
                    <Input 
                        placeholder="Link ảnh..." 
                        prefix={<PictureOutlined />} 
                        onChange={handleImageChange}
                        disabled={uploading}
                    />
                </Form.Item>

                <div style={{ marginBottom: 12 }}>
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            if (file.size > 2 * 1024 * 1024) {
                                message.error('Ảnh phải nhỏ hơn 2MB');
                                return Upload.LIST_IGNORE;
                            }
                            handleUpload(file);
                            return Upload.LIST_IGNORE;
                        }}
                    >
                        <Button 
                            icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} 
                            block 
                            disabled={uploading}
                        >
                            {uploading ? "Đang tải..." : "Tải ảnh từ máy"}
                        </Button>
                    </Upload>
                </div>
                
                {/* Khung hiển thị ảnh preview */}
                <div style={{ 
                    width: '100%', 
                    height: '140px', 
                    borderRadius: '8px', 
                    border: '1px dashed #d9d9d9',
                    background: '#fafafa',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {uploading && (
                        <div style={{ position: 'absolute', zIndex: 1, background: 'rgba(255,255,255,0.8)', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Spin />
                        </div>
                    )}
                    
                    {previewImage ? (
                        <Image 
                            src={previewImage} 
                            alt="Preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            fallback="https://via.placeholder.com/200x140?text=Lỗi+Ảnh"
                        />
                    ) : (
                        <div style={{ textAlign: 'center', color: '#ccc' }}>
                            <PictureOutlined style={{ fontSize: 24, marginBottom: 4 }} />
                            <div style={{ fontSize: 12 }}>Xem trước ảnh</div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- MAP SECTION --- */}
        <Form.Item
          label="Địa điểm"
          name="location"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
          help="Nhập tên địa điểm để tìm kiếm (Dữ liệu từ OpenStreetMap)"
        >
          <AutoComplete
            options={locationOptions}
            onSearch={handleLocationSearch}
            onSelect={handleLocationSelect}
            onBlur={(e) => {
               if (!locationOptions.some(opt => opt.value === e.target.value)) {
                 setPreviewLocation(e.target.value);
               }
            }} 
            placeholder="VD: Đại học Bách Khoa, Hà Nội..."
          >
            <Input 
              suffix={searchingLocation ? <Spin size="small" /> : <EnvironmentOutlined style={{ color: '#bfbfbf' }} />} 
            />
          </AutoComplete>
        </Form.Item>

        {previewLocation && (
          <div style={{ marginBottom: 24, height: 180, width: '100%', borderRadius: 8, overflow: 'hidden', border: '1px solid #d9d9d9', background: '#f0f0f0' }}>
            <iframe
              title="Map Preview"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(previewLocation)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
            label="Thời gian tổ chức"
            name="timeRange"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
            >
            <DatePicker.RangePicker showTime style={{ width: "100%" }} placeholder={["Bắt đầu", "Kết thúc"]} />
            </Form.Item>

            <Form.Item
            label="Danh mục"
            name="categoryId"
            style={{ width: '150px' }}
            rules={[{ required: true, message: "Chọn danh mục" }]}
            >
            <Select placeholder="Danh mục" options={categoryOptions} />
            </Form.Item>

            <Form.Item
            label="Số lượng"
            name="capacity"
            style={{ width: '100px' }}
            rules={[{ required: true, message: "Nhập số" }]}
            >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="50" />
            </Form.Item>
        </div>

      </Form>
    </Modal>
  );
}