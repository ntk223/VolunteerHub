import React from 'react';
import { Spin, Divider } from "antd";
import { useSearch } from '../../hooks/useSearch';
import "./SearchPage.css"; // Đảm bảo đã import CSS

const SearchPage = () => {
  const {
    searchQuery = '',
    searchResults = { events: [], users: [], posts: [] },
    searchLoading = false,
    searchCategory = 'all',
  } = useSearch();

  const {
    events = [],
    users = [],
    posts = [],
  } = searchResults;

  const totalResults = events.length + users.length + posts.length;

  
  const renderSummary = () => {
    // 1. Nếu chưa gõ gì
    if (!searchQuery) {
      return (
        <p className="search-empty-state">
          Hãy nhập từ khóa vào ô tìm kiếm để xem kết quả.
        </p>
      );
    }

    // 2. Đang tải
    if (searchLoading) {
      return null;
    }

    // 3. Không tìm thấy
    if (totalResults === 0) {
      return (
        <p className="search-empty-state">
          Không tìm thấy kết quả nào cho từ khóa "<b>{searchQuery}</b>".
        </p>
      );
    }
    
    // 4. Tìm thấy kết quả
    return (
      <>
        <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
        <p>
          Tìm thấy **{totalResults}** mục.
          {searchCategory === 'all' && (
            <span style={{ marginLeft: 10 }}> 
              (Sự kiện: {events.length}, Người dùng: {users.length}, Bài đăng: {posts.length})
            </span>
          )}
        </p>
        <Divider />
      </>
    );
  };
  

  return (
    <div className="search-page search-page-container"> {/* Áp dụng class cho container */}

      {renderSummary()}
      
      {/* 🔵 Đang tải */}
      {searchLoading && (
        <div className="search-loading-container">
          <Spin size="large" tip="Đang tìm kiếm..." />
        </div>
      )}

      {/* 🔍 1. SỰ KIỆN */}
      {!searchLoading && (searchCategory === "all" || searchCategory === "events") &&
        events.length > 0 && (
          <>
            <h3>Sự kiện ({events.length})</h3>
            <ul className="search-results-list">
              {events.map((e) => (
                <li
                  key={e.id}
                  // Xóa style inline và dùng CSS
                >
                  <b>[Sự kiện]</b> {e.title}
                </li>
              ))}
            </ul>
            {(searchCategory === "all") && <Divider />}
          </>
        )}

      {/* 🔍 2. NGƯỜI DÙNG */}
      {!searchLoading && (searchCategory === "all" || searchCategory === "users") &&
        users.length > 0 && (
          <>
            <h3>Người dùng ({users.length})</h3>
            <ul className="search-results-list">
              {users.map((u) => (
                <li
                  key={u.id}
                  // Xóa style inline và dùng CSS
                >
                  <b>[Người dùng]</b> {u.name}
                </li>
              ))}
            </ul>
            {(searchCategory === "all") && <Divider />}
          </>
        )}

      {/* 🔍 3. BÀI ĐĂNG */}
      {!searchLoading && (searchCategory === "all" || searchCategory === "posts") &&
        posts.length > 0 && (
          <>
            <h3>Bài đăng ({posts.length})</h3>
            <ul className="search-results-list">
              {posts.map((p) => (
                <li
                  key={p.id}
                  // Xóa style inline và dùng CSS
                >
                  <b>[Bài viết]</b> {p.title}
                </li>
              ))}
            </ul>
          </>
        )}
    </div>
  );
};

export default SearchPage;