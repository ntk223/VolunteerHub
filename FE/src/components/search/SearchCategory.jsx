import React from 'react';
import { Radio } from 'antd';
import { useSearch } from '../../hooks/useSearch'; // Đảm bảo đường dẫn đúng

const SearchCategory = () => {
    // 1. Tối ưu: Lấy các biến một cách an toàn hơn, 
    // tránh gọi .setSearchCategory nếu useSearch trả về null/undefined
    const context = useSearch();

    // Nếu context không tồn tại (chưa bọc trong Provider), hiển thị thông báo lỗi hoặc không hiển thị gì
    if (!context || !context.setSearchCategory) {
        // Trong môi trường production, thường trả về null để component biến mất
        return null; 
    }

    // 2. Trích xuất các biến cần thiết từ context
    const { searchCategory, setSearchCategory } = context;

    return (
        <div style={{ marginTop: 20 }}>
            <h4 className="text-gray-700 mb-2">Tìm theo loại:</h4>
            
            <Radio.Group
                // ✅ Khi người dùng thay đổi, cập nhật state toàn cục qua setSearchCategory
                onChange={(e) => setSearchCategory(e.target.value)}
                
                // ✅ Đảm bảo value luôn khớp với state hiện tại
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