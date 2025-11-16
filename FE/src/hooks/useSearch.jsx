import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; 

const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("all"); 

    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    
    const initialData = useMemo(() => ({ events: [], users: [], posts: [] }), []);
    
    const [allLocalData, setAllLocalData] = useState(initialData);
    const [searchResults, setSearchResults] = useState(initialData); 
    const [searchApprovedEvents, setSearchApprovedEvents] = useState([]); 

    const debounceRef = useRef(null);
    const navigate = useNavigate();

    // HÀM TẢI DỮ LIỆU BAN ĐẦU TỪ API (Chạy 1 lần)
    useEffect(() => {
        const fetchAllData = async () => {
            if (allLocalData.users.length === 0) {
                setSearchLoading(true);
            }
            try {
                const [eventsRes, usersRes, postsRes] = await Promise.all([
                    api.get("/event"), 
                    api.get("/user"),  
                    api.get("/post"),  
                ]);

                const fetchedData = {
                    events: eventsRes.data || [],
                    users: usersRes.data.filter(user => user.status === "active") || [],
                    posts: postsRes.data.filter(post => post.status === "approved") || [],
                };

                setAllLocalData(fetchedData);
                setSearchResults(fetchedData);
                setSearchApprovedEvents(fetchedData.events.filter(e => e.approvalStatus === "approved"));

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu ban đầu:", err);
                setSearchError("Không thể tải dữ liệu để tìm kiếm.");
            } finally {
                setSearchLoading(false);
            }
        };

        fetchAllData();
    }, []); 

    // 3. Hàm LỌC dữ liệu (sử dụng local data)
    // ⚠️ KHÔNG CÓ navigate("/search") Ở ĐÂY NỮA
    const performLocalFilter = useCallback((query, category = "all") => {
        if (allLocalData.users.length === 0) return;

        if (!query || query.trim() === "") {
            setSearchResults(allLocalData); 
            setSearchApprovedEvents(allLocalData.events.filter(e => e.approvalStatus === "approved"));
            return;
        }

        setSearchLoading(true);
        setSearchError(null);
        
        const lowerQuery = query.toLowerCase().trim();

        const filterBasic = (items, keys) => {
            return items.filter(item => 
                keys.some(key => {
                    const value = item[key];
                    return value && String(value).toLowerCase().includes(lowerQuery);
                })
            );
        };
        
        let events = initialData.events;
        let users = initialData.users;
        let posts = initialData.posts;

        if (category === "all" || category === "events") {
            events = filterBasic(allLocalData.events, ['title', 'description']);
        }
        
        if (category === "all" || category === "users") {
            users = filterBasic(allLocalData.users, ['name']);
        }

        if (category === "all" || category === "posts") {
            posts = filterBasic(allLocalData.posts, ['content']);
        }
        
        setSearchResults({ events, users, posts });
        
        const approvedOnly = events.filter(e => e.approvalStatus === "approved");
        setSearchApprovedEvents(approvedOnly);
        
        setSearchLoading(false);
    }, [allLocalData, initialData]); 

    // 4. HÀM: Kích hoạt tìm kiếm tức thì (ấn Enter/Button)
    const handleSearch = useCallback(() => {
        if (searchQuery.trim() !== "") {
            // Xóa debounce timer
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
            
            // 💡 CHỈ CHUYỂN HƯỚNG KHI NHẤN ENTER
            navigate("/search"); 

            // Gọi lọc ngay lập tức
            performLocalFilter(searchQuery, searchCategory); 
        }
    }, [searchQuery, searchCategory, performLocalFilter, navigate]);


    // 5. Debounce tự động (KHÔNG CHUYỂN HƯỚNG)
    useEffect(() => {
        if (allLocalData.users.length === 0 || !searchQuery.trim()) {
            performLocalFilter(searchQuery, searchCategory);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            performLocalFilter(searchQuery, searchCategory);
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [searchQuery, searchCategory, performLocalFilter, allLocalData]); 

    // Memo hóa value
    const value = useMemo(() => ({
        searchQuery,
        searchCategory,
        searchResults,
        searchApprovedEvents,
        searchLoading,
        searchError,
        setSearchQuery,
        setSearchCategory,
        handleSearch, 
    }), [
        searchQuery,
        searchCategory,
        searchResults,
        searchApprovedEvents,
        searchLoading,
        searchError,
        handleSearch,
    ]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};