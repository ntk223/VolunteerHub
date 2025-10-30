import { Avatar, Typography, Input, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const CommentSection = ({ comments, onCommentChange, onSubmit }) => {
  if (!comments.visible) return null;

  return (
    <div className="comment-section">
      {comments.loading ? (
        <div style={{ padding: 12, textAlign: "center" }}>
          <Spin size="small" />
        </div>
      ) : (
        <>
          <div className="comment-list">
            {(comments.items || []).length === 0 ? (
              <Text type="secondary">Chưa có bình luận</Text>
            ) : (
              (comments.items || []).map((c) => (
                <div
                  className="comment-item"
                  key={c.id || `${c.post_id}-${c.createdAt}`}
                >
                  <Avatar size={28} icon={<UserOutlined />} />
                  <div className="comment-body">
                    <div className="comment-meta">
                      <Text strong>
                        {c.author?.name || c.author_id || "Người dùng"}
                      </Text>
                      <Text type="secondary" className="comment-time">
                        {" "}• {new Date(c.createdAt).toLocaleString()}
                      </Text>
                    </div>
                    <div className="comment-content">{c.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="comment-input">
            <Input.TextArea
              value={comments.input || ""}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={2}
              placeholder="Viết bình luận..."
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <Button type="primary" size="small" onClick={onSubmit}>
                Gửi
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};