import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import api from "../api";

const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all"); 
  // all | users | events | posts

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [searchResults, setSearchResults] = useState({
    events: [],
    users: [],
    posts: [],
  });

  const [searchApprovedEvents, setSearchApprovedEvents] = useState([]);

  // Debounce timer
  const debounceRef = useRef(null);

  const performGlobalSearch = useCallback(async (query, category = "all") => {
    if (!query || query.trim() === "") {
      setSearchResults({ events: [], users: [], posts: [] });
      setSearchApprovedEvents([]);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      let events = [];
      let users = [];
      let posts = [];

      // Tối ưu: Chỉ gọi API theo loại tìm kiếm
      const promises = [];

      if (category === "all" || category === "events") {
        promises.push(
          api.get("/event", { params: { q: query } }).then(res => events = res.data)
        );
      }
      if (category === "all" || category === "users") {
        promises.push(
          api.get("/user", { params: { q: query } }).then(res => users = res.data)
        );
      }
      if (category === "all" || category === "posts") {
        promises.push(
          api.get("/post", { params: { q: query } }).then(res => posts = res.data)
        );
      }

      await Promise.all(promises);

      setSearchResults({ events, users, posts });

      const approvedOnly = events.filter(e => e.approvalStatus === "approved");
      setSearchApprovedEvents(approvedOnly);

    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setSearchError(err.response?.data?.message || "Lỗi kết nối hoặc server.");
      setSearchResults({ events: [], users: [], posts: [] });
      setSearchApprovedEvents([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // 🚀 Debounce khi user gõ chữ
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        performGlobalSearch(searchQuery, searchCategory);
      }
    }, 400); // ⭐ Recommended 350–500 ms

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, searchCategory, performGlobalSearch]);

  const value = {
    searchQuery,
    setSearchQuery,
    
    searchCategory,
    setSearchCategory,

    searchResults,
    searchApprovedEvents,
    searchLoading,
    searchError,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
