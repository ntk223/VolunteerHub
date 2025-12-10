import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const EventSearchBar = ({ value, onChange, onSearch }) => {
  return (
    <div style={{ marginBottom: 16, maxWidth: 500 }}>
      <Search
        placeholder="Tìm kiếm sự kiện theo tên, địa điểm, trạng thái..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        value={value}
        onSearch={onSearch}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default EventSearchBar;
