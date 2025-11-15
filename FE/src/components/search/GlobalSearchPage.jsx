// src/pages/GlobalSearchPage.js (Đã sửa)
import { Input, Spin } from "antd";
import { useSearch } from "../../hooks/useSearch";

const GlobalSearchPage = () => {
  // 1. Cập nhật các biến destructuring để khớp với useSearch
  const { 
    searchQuery,
    setSearchQuery, // ✅ Dùng để cập nhật chuỗi tìm kiếm
    searchResults,  // ✅ Chứa events, users, posts
    searchLoading   // ✅ Dùng thay cho 'loading'
  } = useSearch();

  const handleSearch = (value) => {
    // 2. Dùng setSearchQuery để kích hoạt tìm kiếm (có debounce trong Provider)
    setSearchQuery(value);
  };

  // Trích xuất kết quả từ searchResults
  const { events, users, posts } = searchResults;

  return (
    <div style={{ padding: 20 }}>
      <Input.Search
        placeholder="Tìm kiếm..."
        onSearch={handleSearch}
        // SỬA: `defaultValue` chỉ dùng cho lần render đầu, nên dùng `value` nếu muốn kiểm soát trạng thái.
        // Tuy nhiên, đối với Input.Search, dùng `defaultValue` là chấp nhận được nếu không muốn re-render liên tục.
        defaultValue={searchQuery}
        loading={searchLoading} // ✅ Dùng biến chính xác từ hook
        style={{ width: 300, marginBottom: 20 }}
        allowClear
      />

      {searchLoading && <Spin />}

      {/* 3. Hiển thị kết quả (Dùng biến 'events', 'users', 'posts' đã trích xuất) */}
      <h3>Sự kiện ({events.length})</h3>
      <ul>
        {events.map(e => <li key={e.id}>{e.title}</li>)}
      </ul>

      <h3>Người dùng ({users.length})</h3>
      <ul>
        {users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>

      <h3>Bài đăng ({posts.length})</h3>
      <ul>
        {posts.map(p => <li key={p.id}>{p.title}</li>)}
      </ul>
    </div>
  );
};

export default GlobalSearchPage;