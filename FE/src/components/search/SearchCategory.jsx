import React from 'react';
import { Radio } from 'antd';
import { useSearch } from '../../hooks/useSearch'; // Đảm bảo đường dẫn đúng

const SearchCategory = () => {
    const context = useSearch();

    if (!context || !context.setSearchCategory) {
        return null; 
    }

    const { searchCategory, setSearchCategory } = context;

    return (
        <div style={{ marginTop: 20 }}>
            <h4 className="text-gray-700 mb-2">Tìm theo loại:</h4>
            
            <Radio.Group
                onChange={(e) => setSearchCategory(e.target.value)}
                
                value={searchCategory}
                
                buttonStyle="solid"
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
                <Radio.Button value="all">Tất cả</Radio.Button>
                <Radio.Button value="users">Người dùng</Radio.Button>
                <Radio.Button value="events">Sự kiện</Radio.Button>
                <Radio.Button value="posts">Bài viết</Radio.Button>
            </Radio.Group>
        </div>
    );
};

export default SearchCategory;