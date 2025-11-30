import React, { useState, useRef } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber, message, AutoComplete, Spin } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";
const { TextArea } = Input;

export default function CreateEventModal({ visible, onClose }) {
  const { user } = useAuth();
  
  // Chỉ cho phép manager truy cập
  if (user.role !== "manager") {
    return null;
  }
  const managerId = user.manager.id;
  
  const [loading, setLoading] = useState(false);
  const [previewLocation, setPreviewLocation] = useState(""); // State lưu địa điểm (hoặc tọa độ) để hiển thị map
  
  // State cho tìm kiếm địa điểm (OpenStreetMap)
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

  // --- HÀM TÌM KIẾM ĐỊA ĐIỂM DÙNG OPENSTREETMAP (MIỄN PHÍ) ---
  const handleLocationSearch = async (value) => {
    if (!value) {
      setLocationOptions([]);
      return;
    }

    setSearchingLocation(true);
    
    // Debounce: Chờ người dùng ngừng gõ 500ms mới gọi API
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Gọi API Nominatim của OpenStreetMap
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5&countrycodes=vn`
        );
        const data = await response.json();

        // Map dữ liệu trả về thành Options cho AutoComplete
        const options = data.map((item) => ({
          value: item.display_name, // Giá trị hiển thị trong ô input
          lat: item.lat,            // Lấy vĩ độ từ API
          lon: item.lon,            // Lấy kinh độ từ API
          label: (
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
              <EnvironmentOutlined style={{ marginRight: 8, color: '#1677ff', flexShrink: 0 }} />
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

  // Khi người dùng chọn 1 địa điểm từ danh sách gợi ý
  const handleLocationSelect = (value, option) => {
    // Cập nhật giá trị vào form (Tên địa điểm để lưu vào DB)
    form.setFieldsValue({ location: value });

    // QUAN TRỌNG: Nếu có tọa độ, dùng tọa độ để hiển thị map cho chính xác
    if (option.lat && option.lon) {
      setPreviewLocation(`${option.lat},${option.lon}`);
    } else {
      // Nếu không (trường hợp hiếm), dùng tên địa điểm
      setPreviewLocation(value);
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
      startTime: values.timeRange[0].toISOString(),
      endTime: values.timeRange[1].toISOString(),
      categoryId: values.categoryId,
      capacity: values.capacity,
      managerId: managerId, 
    };

    try {
      setLoading(true);
      await api.post("/event", payload);

      message.success("Tạo sự kiện thành công hãy chờ phê duyệt!");
      form.resetFields();
      setPreviewLocation(""); 
      onClose();
    } catch (err) {
      console.error(err);
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
      destroyOnHidden
      style={{ top: 40 }}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>

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

        {/* --- AUTOCOMPLETE OPENSTREETMAP --- */}
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
            // Cho phép người dùng gõ xong rồi click ra ngoài vẫn nhận giá trị (nếu không chọn từ list)
            onBlur={(e) => {
               // Chỉ cập nhật map nếu người dùng tự gõ và chưa chọn từ list (để tránh ghi đè tọa độ chính xác)
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

        {/* --- MAP PREVIEW (GOOGLE MAPS LEGACY - NO KEY) --- */}
        {previewLocation && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              height: 200, 
              width: '100%', 
              borderRadius: 8, 
              overflow: 'hidden', 
              border: '1px solid #d9d9d9',
              marginTop: 8,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Sử dụng Google Maps Embed với query là Tọa độ hoặc Tên địa điểm */}
              <iframe
                title="Map Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                // Nếu previewLocation là tọa độ (vd: 10.7,106.6), Google Maps sẽ hiển thị vị trí đó chính xác
                src={`https://maps.google.com/maps?q=${encodeURIComponent(previewLocation)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'rgba(255,255,255,0.8)',
                padding: '2px 6px',
                fontSize: '10px',
                color: '#666'
              }}>
                Preview
              </div>
            </div>
          </div>
        )}

        <Form.Item
          label="Thời gian tổ chức"
          name="timeRange"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePicker.RangePicker
            showTime
            style={{ width: "100%" }}
            placeholder={["Bắt đầu", "Kết thúc"]}
          />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="categoryId"
          rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
        >
          <Select placeholder="Chọn danh mục" options={categoryOptions} />
        </Form.Item>

        <Form.Item
          label="Số lượng tối đa"
          name="capacity"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            {
              validator(_, value) {
                if (!value || value < 1)
                  return Promise.reject("Số lượng phải lớn hơn 0");
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} placeholder="VD: 50" />
        </Form.Item>

      </Form>
    </Modal>
  );
}