import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber, message } from "antd";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;

export default function CreateEventModal({ visible, onClose }) {
  const { user } = useAuth();
  if (user.role !== "manager") {
    return null;
  }
  const managerId = user.manager.id;
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();


  const categoryOptions = [
    { value: 1, label: "Môi trường" },
    { value: 2, label: "Giáo dục" },
    { value: 3, label: "Cộng đồng" },
    { value: 4, label: "Y tế" },
    { value: 5, label: "Văn hóa - Nghệ thuật" },
  ];

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

        <Form.Item
          label="Địa điểm"
          name="location"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
        >
          <Input placeholder="VD: Hội trường A, Trung tâm văn hóa..." />
        </Form.Item>

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
