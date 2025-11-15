import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import api from "../api";
import { useAuth } from "./useAuth.jsx";

const PostsContext = createContext(null);

export const PostsProvider = ({ children, postType }) => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]); // Lưu posts gốc để sorting
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' hoặc 'popularity'

  // 🔹 State quản lý comment theo postId
  const [commentsMap, setCommentsMap] = useState({});
  const [newComments, setNewComments] = useState({}); 
  const [likeModalVisible, setLikeModalVisible] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);
  const [isOpenedComments, setIsOpenedComments] = useState({}); // Quản lý trạng thái mở comment theo postId
 
  const [postLikedbyUser, setPostLikedbyUser] = useState({}); // Lưu trạng thái like của từng post theo user

  // 🔹 Lấy danh sách bài viết
  useEffect(() => {
    
    setLoading(true);
    setPosts([]);

    const fetchPosts = async () => {
      try {
        if (!postType) {
          const resAll = await api.get(`/post/`);
          setOriginalPosts(resAll.data);
          setPosts(resAll.data);
          return;
        }
        const res = await api.get(`/post/${postType}`);
        setOriginalPosts(res.data);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postType, user?.id]);

  // 🔹 Danh sách xem người đang login đã like những bài nào
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (!user?.id) return;
      try {
        const res = await api.get(`/like/user/${user.id}`);
        const likedPosts = {};
        res.data.forEach((like) => {
          likedPosts[like.postId] = true;
        });
        setPostLikedbyUser(likedPosts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserLikes();
}, [user?.id]);

  // 🔹 Sắp xếp bài viết
  const sortPosts = useCallback((posts, sortType) => {
    const sortedPosts = [...posts];
    
    if (sortType === 'popularity') {
      return sortedPosts.sort((a, b) => {
        const popularityA = (a.likeCount || 0) + (a.commentCount || 0);
        const popularityB = (b.likeCount || 0) + (b.commentCount || 0);
        return popularityB - popularityA; // Giảm dần
      });
    } else {
      return sortedPosts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt); // Mới nhất trước
      });
    }
  }, []);

  // 🔹 Effect để sắp xếp khi sortBy thay đổi
  useEffect(() => {
    if (originalPosts.length > 0) {
      const sorted = sortPosts(originalPosts, sortBy);
      setPosts(sorted);
    }
  }, [sortBy, originalPosts, sortPosts]);

  // 🔹 Hàm thay đổi kiểu sắp xếp
  const changeSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  // 🔹 Like / Unlike bài viết
  const toggleLike = useCallback(async (postId) => {
    try {
        console.log("Toggling like for postId:", postId, "by userId:", user.id);
        const res = await api.post(`/like`, { postId, userId: user.id }); 
        // console.log(res);
        const { like, isLiked } = res.data; // Lấy dữ liệu mới
        let cnt = -1;
        if (isLiked) cnt = 1;
        setPosts((prev) => {
            const updatedPosts = prev.map((p) =>
                p.id === postId
                    ? { ...p, likeCount: p.likeCount + cnt } 
                    : p
            );
            return updatedPosts;
        });
        setPostLikedbyUser((prev) => ({
        ...prev,
        [postId]: isLiked,
    }));
    } catch (error) {
        // Nếu lỗi, không thay đổi trạng thái UI
        console.error(error);
    }
}, [user.id]);

  // 🔹 Mở modal xem lượt like
  const openLikes = useCallback(async (postId) => {
    try {
      const res = await api.get(`/like/post/${postId}`);
      setLikeUsers(res.data);
      setLikeModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const closeLikes = useCallback(() => setLikeModalVisible(false), []);

  // 🔹 Lấy danh sách bình luận cho 1 bài viết
  const toggleComments = useCallback(async (postId) => {
    try {
      const res = await api.get(`/comment/post/${postId}`);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: res.data, // chỉ lưu comment của postId này
      }));
      setIsOpenedComments((prev) => ({
        ...prev,
        [postId]: !prev[postId], // toggle trạng thái hiển thị
      }));
      // console.log("aaa", res);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // 🔹 Xử lý thay đổi nội dung bình luận mới
  const handleCommentChange = useCallback((postId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  }, []);

  // 🔹 Gửi bình luận
  const submitComment = useCallback(async (postId) => {
    const content = newComments[postId];
    if (!content?.trim()) return;

    try {
      const res = await api.post(`/comment/`, {
        postId,
        authorId: user.id,
        content,
      });
      setPosts((prev) => {
        const updatedPosts = prev.map((p) =>
          p.id === postId
            ? { ...p, commentCount: p.commentCount + 1 } 
            : p
        );
        return updatedPosts;
      });
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }));

      setNewComments((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error(error);
    }
  }, [newComments, user.id]);

  // 🔹 Sửa bình luận
  const editComment = useCallback(async (commentId, content) => {
    try {
      const res = await api.put(`/comment/${commentId}`, { content });
      
      // Cập nhật comment trong commentsMap
      setCommentsMap((prev) => {
        const updatedMap = { ...prev };
        Object.keys(updatedMap).forEach((postId) => {
          updatedMap[postId] = updatedMap[postId].map((comment) =>
            comment.id === commentId ? res.data : comment
          );
        });
        return updatedMap;
      });
      
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  // 🔹 Xóa bình luận
  const deleteComment = useCallback(async (commentId) => {
    try {
      await api.delete(`/comment/${commentId}`);
      
      // Xóa comment khỏi commentsMap và giảm commentCount
      setCommentsMap((prev) => {
        const updatedMap = { ...prev };
        let postIdToUpdate = null;
        
        Object.keys(updatedMap).forEach((postId) => {
          const commentIndex = updatedMap[postId].findIndex((comment) => comment.id === commentId);
          if (commentIndex !== -1) {
            updatedMap[postId] = updatedMap[postId].filter((comment) => comment.id !== commentId);
            postIdToUpdate = postId;
          }
        });
        
        // Cập nhật commentCount trong posts
        if (postIdToUpdate) {
          setPosts((prev) => {
            const updatedPosts = prev.map((p) =>
              p.id === parseInt(postIdToUpdate)
                ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
                : p
            );
            // Cập nhật originalPosts
            setOriginalPosts(updatedPosts);
            // Nếu đang sắp xếp theo popularity, sắp xếp lại
            if (sortBy === 'popularity') {
              return sortPosts(updatedPosts, sortBy);
            }
            return updatedPosts;
          });
        }
        
        return updatedMap;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const value = {
    posts,
    loading,
    commentsMap,
    newComments,
    likeModalVisible,
    likeUsers,
    postLikedbyUser,
    isOpenedComments,
    sortBy,
    toggleLike,
    openLikes,
    closeLikes,
    toggleComments,
    handleCommentChange,
    submitComment,
    editComment,
    deleteComment,
    changeSortBy,
  };

  useEffect(() => {
      const onCreated = (e) => {
        const created = e.detail;
        if (!created) return;
        // Nếu postType khớp hoặc đang fetch all, thêm vào list và sắp xếp lại
        if (!postType || created.postType === postType) {
          setOriginalPosts((prev) => [created, ...prev]);
          setPosts((prevPosts) => {
            const newPosts = [created, ...prevPosts];
            return sortPosts(newPosts, sortBy);
          });
        }
      };
      window.addEventListener("post:created", onCreated);
      return () => window.removeEventListener("post:created", onCreated);
    }, [postType, sortBy, sortPosts]);

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts() phải được dùng bên trong <PostsProvider>");
  }
  return context;
};
