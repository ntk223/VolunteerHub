import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Modal, Form, Input, Select, message, Spin } from "antd";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;

export default function CreatePostModal({ visible, onClose }) {
  const { user } = useAuth();
  const role = user?.role;

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [searching, setSearching] = useState(false);

  const [form] = Form.useForm();
  const searchRef = useRef(null);
  const mountedRef = useRef(true);

  const allowedTypes =
    role === "manager"
      ? [
          { label: "Discussion", value: "discuss" },
          { label: "Recruitment", value: "recruitment" },
        ]
      : [{ label: "Discussion", value: "discuss" }];

  const normalizeEvent = (e) => ({
    id: e.id,
    title: e.title,
    managerId: e.manager_id,
    raw: e,
  });

  
  const fetchAllEvents = useCallback(async (search = "") => {
    setSearching(true);
    try {
      const url = search
        ? `/event?search=${encodeURIComponent(search)}`
        : `/event`;

      const res = await api.get(url);
      const list = Array.isArray(res.data) ? res.data : [];

      if (mountedRef.current) setEvents(list.map(normalizeEvent));
    } finally {
      if (mountedRef.current) setSearching(false);
    }
  }, []);

  
  const fetchManagerEvents = useCallback(
    async (search = "") => {
      setSearching(true);
      try {
        const res = await api.get(`/event/manager/${user.id}`);
        let list = Array.isArray(res.data) ? res.data : [];

        if (search.trim() !== "") {
          const q = search.trim().toLowerCase();
          list = list.filter((ev) =>
            (ev.title || "").toLowerCase().includes(q)
          );
        }

        if (mountedRef.current) setEvents(list.map(normalizeEvent));
      } finally {
        if (mountedRef.current) setSearching(false);
      }
    },
    [user?.id]
  );

  /** postType state */
  const [postType, setPostType] = useState(allowedTypes[0].value);

  /** INIT LOAD - always load full event list */
  useEffect(() => {
    fetchAllEvents();
    return () => {
      mountedRef.current = false;
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [fetchAllEvents]);

  /**
   * Reload events when postType changes
   */
  useEffect(() => {
    if (postType === "recruitment") {
      fetchManagerEvents();
    } else {
      fetchAllEvents();
    }
  }, [postType, fetchManagerEvents, fetchAllEvents]);

  
  const handleSearch = useCallback(
    (text) => {
      form.setFieldsValue({ eventSearchText: text });

      if (searchRef.current) clearTimeout(searchRef.current);

      searchRef.current = setTimeout(() => {
        if (postType === "recruitment") {
          fetchManagerEvents(text);
        } else {
          fetchAllEvents(text);
        }
      }, 300);
    },
    [postType, fetchAllEvents, fetchManagerEvents]
  );

  
  const filteredEvents = useMemo(() => {
    const search = (form.getFieldValue("eventSearchText") || "")
      .trim()
      .toLowerCase();

    if (!search) return events.slice(0, 40);

    const result = events
      .filter((ev) => (ev.title || "").toLowerCase().includes(search))
      .sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(search);
        const bStarts = b.title.toLowerCase().startsWith(search);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return a.title.length - b.title.length;
      });

    return result.slice(0, 40);
  }, [events, form]);

  /**
   * Submit form
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        authorId: user.id,
        content: values.content,
        postType: values.postType,
        eventId: values.eventId || null,
      };

      const res = await api.post("/post", payload);

      if (res.data?.status === "approved") {
        message.success("Đăng bài thành công");
        window.dispatchEvent(new CustomEvent("post:created", { detail: res.data }));
      } else {
        message.info("Bài viết đã được gửi và đang chờ duyệt.");
      }

      form.resetFields();
      setPostType(allowedTypes[0].value);
      onClose();
    } catch (err) {
      message.error(err?.response?.data?.message || "Không thể tạo bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo bài viết mới"
      open={visible}
      onCancel={onClose}
      okText="Đăng"
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ postType: allowedTypes[0].value }}
        onValuesChange={(changed, all) => {
          if (changed.postType) setPostType(all.postType);
        }}
      >

        {/* Hidden field để lưu text search */}
        <Form.Item name="eventSearchText" style={{ display: "none" }}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item label="Loại bài viết" name="postType">
          <Select options={allowedTypes} />
        </Form.Item>

        <Form.Item
          label={
            postType === "recruitment"
              ? "Chọn sự kiện (bắt buộc)"
              : "Chọn sự kiện (tuỳ chọn)"
          }
          name="eventId"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue("postType") === "recruitment" && !value) {
                  return Promise.reject(
                    new Error("Vui lòng chọn sự kiện cho bài tuyển dụng")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Select
            showSearch
            allowClear={postType !== "recruitment"}
            placeholder="Chọn sự kiện"
            onSearch={handleSearch}
            filterOption={false}
            options={filteredEvents.map((e) => ({
              label: e.title || `Event ${e.id}`,
              value: e.id,
            }))}
            notFoundContent={
              searching ? <Spin size="small" /> : "Không tìm thấy sự kiện"
            }
            popupMatchSelectWidth={360}
          />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <TextArea rows={5} placeholder="Viết gì đó..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
