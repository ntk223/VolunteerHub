import React from 'react';
import { Input, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const categoryOptions = [
  { value: 1, label: "Môi trường" },
  { value: 2, label: "Giáo dục" },
  { value: 3, label: "Cộng đồng" },
  { value: 4, label: "Y tế" },
  { value: 5, label: "Văn hóa - Nghệ thuật" },
];

const EventFilters = ({ 
  searchText, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  categoryFilter,
  onCategoryChange
}) => {
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
          value={categoryFilter}
          onChange={onCategoryChange}
          style={{ width: 180 }}
          placeholder="Danh mục"
        >
          <Option value="all">Tất cả danh mục</Option>
          {categoryOptions.map(cat => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Select>

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
