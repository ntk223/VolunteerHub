import { useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import { Layout, Input, Spin, Button, Typography, Select, theme } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./SearchSidebar.css"; 

const { Sider } = Layout;
const { Text } = Typography;
const { Option } = Select;

const SearchSidebar = ({ isMobile }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  
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
  const resetDisplayLimit = () => setDisplayLimit(10);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    resetDisplayLimit();
  };

  const handlePressEnter = () => {
    handleSearch();
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
  };

  const renderResults = () => {
    if (searchQuery.trim() === "" && !searchLoading) return null;

    const items = [
      ...searchApprovedEvents.map(item => ({ ...item, resultType: 'E', type: 'events' })),
      ...searchResults.users.map(item => ({ ...item, resultType: 'U', type: 'profile' })),
      ...searchResults.posts.map(item => ({ ...item, resultType: 'P', type: 'post' })),
    ];

    const displayedItems = items.slice(0, displayLimit);
    const hasMore = items.length > displayLimit;

    if (!searchLoading && items.length === 0 && searchQuery.trim() !== "") {
      return (
        <div className="search-results">
          <div className="no-results">
            <span>🔍</span>
            <p>Không tìm thấy kết quả</p>
            <small>Thử từ khóa khác xem sao!</small>
          </div>
        </div>
      );
    }

    if (items.length > 0) {
      return (
        <div className="search-results">
          <div className="results-header">
            <h4>Kết quả tìm kiếm ({items.length})</h4>
            <small>Đang hiển thị {displayedItems.length} kết quả</small>
          </div>
          <div className="results-list">
            {displayedItems.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                className="result-item"
                to={item.type === 'events' ? `/events` : `/${item.type}/${item.id}`} 
                onClick={() => {}}
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
                className="show-more-btn"
                icon={<EyeOutlined />}
                onClick={() => setDisplayLimit((prev) => prev + 10)}
                size="middle"
                block
              >
                Xem thêm ({items.length - displayLimit})
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
      width={isMobile ? "100%" : 300}
      className={isMobile ? "custom-sider-search mobile-sider" : "desktop-sidebar right custom-sider-search"}
      theme="light"
      style={{
        position: isMobile ? "relative" : "sticky",
        top: isMobile ? 0 : 64,
        height: isMobile ? "100%" : "calc(100vh - 64px)",
        borderLeft: isMobile ? "none" : "1px solid var(--border-color)",
        backgroundColor: "var(--sidebar-bg)",
        overflowY: "auto",
        transition: "all 0.3s",
      }}
    >
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: 16 }}>
           <Text strong style={{ color: "var(--text-color)", fontSize: 16 }}>
             Tìm kiếm
           </Text>
        </div>

        <div className="search-input-container">
          <Input
            placeholder="Tìm sự kiện, người dùng..."
            prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
            allowClear
            value={searchQuery}
            onChange={handleInputChange}
            onPressEnter={handlePressEnter}
            onClear={() => setSearchQuery("")}
            className="search-input"
            size="large"
          />
        </div>

        <div className="category-select">
          <Select
            value={searchCategory}
            onChange={setSearchCategory}
            style={{ 
              width: '100%',
              backgroundColor: token.colorBgContainer,
            }}
            size="large"
            dropdownStyle={{
              backgroundColor: token.colorBgElevated,
            }}
          >
            <Option value="all">Tất cả danh mục</Option>
            <Option value="events">Sự kiện</Option>
            <Option value="users">Người dùng</Option>
            <Option value="posts">Bài viết</Option>
          </Select>
        </div>

        {searchLoading && (
          <div className="loading-container">
            <Spin size="small" />
            <span style={{ marginLeft: 8, color: "var(--text-secondary)" }}>
              Đang tìm dữ liệu...
            </span>
          </div>
        )}

        {searchError && <div className="error">{searchError}</div>}

        {renderResults()}
      </div>
    </Sider>
  );
};

export default SearchSidebar;