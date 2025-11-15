import React from "react";
import { Layout, Input, Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSearch } from "../../hooks/useSearch";

const { Sider } = Layout;

const SearchSidebar = () => {
    const {
        searchQuery,
        setSearchQuery,
        searchCategory,
        setSearchCategory
    } = useSearch() || {};

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase().trim();
        setSearchQuery(query);
    };

    return (
        <Sider
            width={450}
            style={{
                background: "#fff",
                borderLeft: "1px solid #cfc6c6ff",
                padding: "16px",
                height: "calc(100vh - 64px)",
                position: "sticky",
                top: 64,
                alignSelf: "flex-start",
            }}
        >
            {/* 🔎 Ô nhập từ khóa */}
            <Input
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchQuery}
                onChange={handleSearch}
                style={{ borderRadius: 8 }}
            />

            {/* 🔽 Bộ lọc loại tìm kiếm */}
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

            {/* ⬇️ Khu vực dành cho bộ lọc nâng cao */}
            <div className="mt-6 text-gray-500">
                {/* Bạn có thể thêm bộ lọc theo ngày, tags, trạng thái,... */}
                <i>Các bộ lọc nâng cao sẽ được thêm tại đây...</i>
            </div>
        </Sider>
    );
};

export default SearchSidebar;
