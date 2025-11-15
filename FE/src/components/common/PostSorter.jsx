import React from 'react';
import { Select, Space, Typography } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const PostSorter = ({ sortBy, onSortChange }) => {
  return (
    <Space align="center" style={{ marginBottom: 16, marginTop: 30 }}>
      <SortAscendingOutlined style={{ color: '#666' }} />
      <Text style={{ color: '#666' }}>Sắp xếp theo:</Text>
      <Select
        value={sortBy}
        onChange={onSortChange}
        style={{ width: 200 }}
        size="small"
      >
        <Option value="createdAt">Thời gian tạo (Mới nhất)</Option>
        <Option value="popularity">Độ phổ biến (Lượt thích + Bình luận)</Option>
      </Select>
    </Space>
  );
};

export default PostSorter;