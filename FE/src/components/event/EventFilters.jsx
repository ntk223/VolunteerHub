import React from 'react';
import { Input, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const EventFilters = ({ searchText, onSearchChange, sortBy, onSortChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <Title level={2} style={{ margin: 0 }}>
        Sự kiện tình nguyện
      </Title>
      
      <Space size="middle">
        <Select
          value={sortBy}
          onChange={onSortChange}
          style={{ width: 180 }}
          placeholder="Sắp xếp theo"
        >
          <Option value="newest">Mới nhất</Option>
          <Option value="hot">Sự kiện HOT 🔥</Option>
          <Option value="participants">Nhiều người tham gia</Option>
          <Option value="startTime">Sắp diễn ra</Option>
        </Select>
        
        <Input
          placeholder="Tìm kiếm sự kiện, địa điểm..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Space>
    </div>
  );
};

export default EventFilters;
