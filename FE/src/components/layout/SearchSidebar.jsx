import { useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import { Layout, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 👈 THÊM HOOK NAVIGATE
import "./SearchSidebar.css";

const { Sider } = Layout;

const SearchSidebar = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchCategory,
    searchResults,
    searchApprovedEvents,
    searchLoading,
    searchError,
    handleSearch,
  } = useSearch();

  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // 👈 KHỞI TẠO NAVIGATE

  // Hàm xử lý khi người dùng gõ
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim() !== "");
  };

  // Xử lý khi nhấn Enter (Ant Design sử dụng onPressEnter)
  const handlePressEnter = () => {
    handleSearch();
    setShowDropdown(false);
  };

  // 💡 HÀM XỬ LÝ CHUYỂN HƯỚNG KHI CLICK VÀO ITEM
  const handleNavigate = (type, id) => {
    let path = '';

    // Xác định đường dẫn dựa trên loại kết quả
    switch (type) {
      case 'user':
        path = `/profile/${id}`;
        break;
      case 'event':
        path = `/event/${id}`; // Giả định đường dẫn chi tiết sự kiện
        break;
      case 'post':
        path = `/post/${id}`; // Giả định đường dẫn chi tiết bài viết
        break;
      default:
        return;
    }

    navigate(path);
    setShowDropdown(false); // Đóng dropdown
    setSearchQuery(''); // Xóa từ khóa tìm kiếm
  };

  // Hiển thị kết quả autocomplete
  const renderDropdown = () => {
    if (!showDropdown || searchQuery.trim() === "" || searchLoading) return null;

    // 💡 Xây dựng danh sách kết quả kèm theo thông tin loại (type)
    const items = [
      ...searchApprovedEvents.map(item => ({ ...item, resultType: 'Sự kiện', type: 'event' })),
      ...searchResults.users.map(item => ({ ...item, resultType: 'Người dùng', type: 'user' })),
      ...searchResults.posts.map(item => ({ ...item, resultType: 'Bài viết', type: 'post' })),
    ];

    const limitedItems = items.slice(0, 5);

    if (limitedItems.length === 0) {
      return <div className="dropdown-item muted">Không tìm thấy kết quả</div>;
    }

    return limitedItems.map((item) => (
      <div
        key={item.id}
        className="dropdown-item"
        // GẮN SỰ KIỆN CLICK VÀO ĐÂY
        onClick={() => handleNavigate(item.type, item.id)}
      >
        <span className="result-type-label">[{item.resultType}]</span>
        {item.name || item.title || `ID: ${item.id}`}
        {item.approvalStatus === "approved" && <span className="approved-badge">✔</span>}
      </div>
    ));
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

      <div className="search-input-container">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ borderRadius: 8 }}
          value={searchQuery}
          onChange={handleInputChange}
          onPressEnter={handlePressEnter}
          className="search-input"
        />

        <div className="dropdown">
          {searchLoading && <div className="dropdown-item loading">Đang tải...</div>}
          {!searchLoading && renderDropdown()}
        </div>
      </div>

      <div className="category-select">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="all">Tất cả</option>
          <option value="events">Sự kiện</option>
          <option value="users">Người dùng</option>
          <option value="posts">Bài viết</option>
        </select>
      </div>

      {searchLoading && (
        <div style={{ marginTop: 15, textAlign: "center" }}>
          <Spin size="small" />
        </div>
      )}

      {searchError && <div className="error">{searchError}</div>}
    </Sider>
  );
};

export default SearchSidebar;