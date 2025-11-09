import { Modal, Avatar } from "antd";
const PostPreview = ({selectedPost, isModalOpen, setIsModalOpen }) => {
    return (
        <Modal
        title="Xem trước bài viết"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedPost && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Avatar src={selectedPost.author?.avatarUrl} />
              <div>
                <strong>{selectedPost.author?.name}</strong>
                <div className="text-gray-500 text-sm">
                  Loại: {selectedPost.postType}
                </div>
              </div>
            </div>
            <p style={{ marginTop: "1rem" }}>{selectedPost.content}</p>
            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt="post"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginTop: "8px",
                }}
              />
            )}
          </div>
        )}
      </Modal>
    )
}

export default PostPreview;