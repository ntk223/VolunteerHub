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
  const [loading, setLoading] = useState(true);

  // 🔹 State quản lý comment theo postId
  const [commentsMap, setCommentsMap] = useState({});
  const [newComments, setNewComments] = useState({}); 
  const [likeModalVisible, setLikeModalVisible] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);
  

  const [postLikedbyUser, setPostLikedbyUser] = useState({}); // Lưu trạng thái like của từng post theo user

  // 🔹 Lấy danh sách bài viết
  useEffect(() => {
    
    setLoading(true);
    setPosts([]);
    if (!postType) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await api.get(`/post/${postType}`);
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
  // 🔹 Like / Unlike bài viết
  const toggleLike = useCallback(async (postId) => {
    try {
        console.log("Toggling like for postId:", postId, "by userId:", user.id);
        const res = await api.post(`/like`, { postId, userId: user.id }); 
        // console.log(res);
        const { like, isLiked } = res.data; // Lấy dữ liệu mới
        let cnt = -1;
        if (isLiked) cnt = 1;
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId
                    ? { ...p, likeCount: p.likeCount + cnt } 
                    : p
            )
        );
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

  const value = {
    posts,
    loading,
    commentsMap,
    newComments,
    likeModalVisible,
    likeUsers,
    postLikedbyUser,
    toggleLike,
    openLikes,
    closeLikes,
    toggleComments,
    handleCommentChange,
    submitComment,
  };

  useEffect(() => {
      const onCreated = (e) => {
        const created = e.detail;
        if (!created) return;
        // Nếu postType khớp hoặc đang fetch all, thêm vào đầu list
        if (!postType || created.postType === postType) {
          setPosts((prev) => [created, ...prev]);
        }
      };
      window.addEventListener("post:created", onCreated);
      return () => window.removeEventListener("post:created", onCreated);
    }, [postType]);

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts() phải được dùng bên trong <PostsProvider>");
  }
  return context;
};
