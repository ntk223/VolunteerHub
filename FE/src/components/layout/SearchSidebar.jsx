import { useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import { Layout, Input, Spin, Button } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom"; // 👈 THÊM HOOK NAVIGATE
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
    setSearchCategory,
  } = useSearch();

  const [displayLimit, setDisplayLimit] = useState(10);
  const navigate = useNavigate(); // 👈 KHỞI TẠO NAVIGATE

  // Reset display limit when search query changes
  const resetDisplayLimit = () => setDisplayLimit(10);

  // Hàm xử lý khi người dùng gõ
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    resetDisplayLimit(); // Reset limit when search query changes
    // Tự động tìm kiếm khi người dùng gõ (debounce có thể được thêm ở useSearch hook)
    // if (e.target.value.trim() !== "") {
    //   handleSearch();
    // }
  };

  // Xử lý khi nhấn Enter (Ant Design sử dụng onPressEnter)
  const handlePressEnter = () => {
    handleSearch();
  };

  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
  };



  // Hiển thị kết quả tìm kiếm
  const renderResults = () => {
    if (searchQuery.trim() === "" && !searchLoading) return null;

    // 💡 Xây dựng danh sách kết quả kèm theo thông tin loại (type)
    const items = [
      ...searchApprovedEvents.map(item => ({ ...item, resultType: 'Sự kiện', type: 'event' })),
      ...searchResults.users.map(item => ({ ...item, resultType: 'Người dùng', type: 'profile' })),
      ...searchResults.posts.map(item => ({ ...item, resultType: 'Bài viết', type: 'post' })),
    ];

    const displayedItems = items.slice(0, displayLimit);
    const hasMore = items.length > displayLimit;

    if (!searchLoading && items.length === 0 && searchQuery.trim() !== "") {
      return (
        <div className="search-results">
          <div className="no-results">
            <span>🔍</span>
            <p>Không tìm thấy kết quả phù hợp</p>
            <small>Thử tìm kiếm với từ khóa khác</small>
          </div>
        </div>
      );
    }

    if (items.length > 0) {
      return (
        <div className="search-results">
          <div className="results-header">
            <h4>Kết quả tìm kiếm ({items.length})</h4>
            <small>Hiển thị {displayedItems.length} / {items.length} kết quả</small>
          </div>
          <div className="results-list">
            {displayedItems.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                className="result-item"
                to={`/${item.type}/${item.id}`}
                onClick={() => {
                  setSearchQuery('');
                  resetDisplayLimit();
                }}
              >
                <span className="result-type-label">{item.resultType}</span>
                <span
                  className="result-title"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      item.name || item.title || item.content || `ID: ${item.id}`,
                      searchQuery
                    ),
                  }}
                ></span>

                {item.approvalStatus === "approved" && (
                  <span className="approved-badge">✓</span>
                )}
              </Link>
            ))}
          </div>
          
          {hasMore && (
            <div className="show-more-container">
              <Button 
                type="primary"
                icon={<EyeOutlined />}
                className="show-more-btn"
                onClick={() => setDisplayLimit(prev => prev + 10)}
                size="small"
              >
                Hiển thị thêm ({items.length - displayLimit})
              </Button>
            </div>
          )}
        </div>
      );
    }

    return null;
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
          placeholder="Tìm kiếm sự kiện, người dùng, bài viết..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ borderRadius: 8 }}
          value={searchQuery}
          onChange={handleInputChange}
          onPressEnter={handlePressEnter}
          onClear={() => setSearchQuery('')}
          className="search-input"
        />
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

      {/* Loading state */}
      {searchLoading && (
        <div className="loading-container">
          <Spin size="small" />
          <span style={{ marginLeft: 8, color: '#64748b' }}>Đang tìm kiếm...</span>
        </div>
      )}

      {/* Error state */}
      {searchError && <div className="error">{searchError}</div>}

      {/* Search results */}
      {renderResults()}
    </Sider>
  );
};

export default SearchSidebar;