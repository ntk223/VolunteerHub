import React, { useMemo } from "react";
import { Image } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

const getMediaType = (url) => {
  if (!url) return "image";
  const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)($|\?)/i.test(url);
  return isVideo ? "video" : "image";
};

const PostMedia = ({ media }) => {
  const items = useMemo(() => {
    if (!media || !Array.isArray(media)) return [];
    return media.map((url) => ({
      src: url,
      type: getMediaType(url),
    }));
  }, [media]);

  if (items.length === 0) return null;

  const count = items.length;
  const visibleItems = items.slice(0, 4);
  const hiddenItems = items.slice(4);
  const isSingle = count === 1;

  // --- CẤU HÌNH GRID ---
  const gridStyle = {
    display: "grid",
    gap: "4px",
    width: "100%",
    overflow: "hidden",
    borderRadius: "8px",
    // THAY ĐỔI QUAN TRỌNG:
    // Thay vì set height cố định, ta dùng aspect-ratio.
    // - 1 ảnh: Tự do (hoặc max-height)
    // - 2 ảnh: 16/9 (giống Youtube/FB thumbnail)
    // - 3+ ảnh: 4/3 hoặc 1/1 (Vuông vắn hơn)
    aspectRatio: isSingle ? "auto" : count === 2 ? "16/9" : "4/3",
    gridTemplateColumns: isSingle ? "1fr" : "1fr 1fr",
    gridTemplateRows: count >= 3 ? "1fr 1fr" : "1fr",
  };

  return (
    // Bọc div ngoài để giới hạn max-height cho trường hợp 1 ảnh quá dài
    <div style={{ width: "100%", maxHeight: "600px" }}>
      <div style={gridStyle}>
        <Image.PreviewGroup>
          {visibleItems.map((item, index) => {
            const isVideo = item.type === "video";
            const isLast = index === 3;
            const remaining = count - 4;

            // Xử lý ô grid
            const cellStyle = {
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              // Nếu có 3 ảnh, ảnh đầu tiên bên trái sẽ cao gấp đôi (span 2 dòng)
              gridRow: count === 3 && index === 0 ? "span 2" : undefined,
            };

            return (
              <div key={index} style={cellStyle}>
                {isVideo ? (
                  // --- XỬ LÝ VIDEO ---
                  <div style={{ width: "100%", height: "100%", background: "#000" }}>
                    <video
                      src={item.src}
                      controls
                      // QUAN TRỌNG: object-fit: cover giúp video lấp đầy ô grid, mất viền đen
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", 
                        display: "block"
                      }}
                    />
                  </div>
                ) : (
                  // --- XỬ LÝ ẢNH ---
                  <Image
                    src={item.src}
                    style={{
                      width: "100%",
                      height: "100%", 
                      objectFit: "cover", // Cắt ảnh thừa
                      display: "block",
                    }}
                    // CSS cho wrapper của Antd cũng phải full
                    wrapperStyle={{ 
                      width: "100%", 
                      height: "100%",
                      display: "block" 
                    }}
                  />
                )}

                {/* --- OVERLAY +N ẢNH --- */}
                {isLast && remaining > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      pointerEvents: "none", 
                    }}
                  >
                    +{remaining}
                  </div>
                )}
              </div>
            );
          })}
        </Image.PreviewGroup>

        {/* Ảnh ẩn để preview */}
        <div style={{ display: "none" }}>
          {hiddenItems.map((item, i) =>
            item.type === "image" ? <Image key={`h-${i}`} src={item.src} /> : null
          )}
        </div>
      </div>
    </div>
  );
};

export default PostMedia;