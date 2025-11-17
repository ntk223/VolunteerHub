import { Image } from "antd";

const mockData = {
  mixed: [
    { type: "image", src: "https://picsum.photos/seed/picsum1/800/600" },
    { type: "image", src: "https://picsum.photos/seed/picsum2/800/600" },
    { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { type: "image", src: "https://picsum.photos/seed/picsum3/800/600" },
    { type: "image", src: "https://picsum.photos/seed/picsum4/800/600" },
  ]
};
const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const PostImages = ({ media }) => {
  media = mockData.mixed; // DEMO

  if (!media || media.length === 0) return null;

  const count = media.length;
  const visible = media.slice(0, 4);
  const hidden = media.slice(4);

  const gridStyle = {
    display: "grid",
    gap: "4px",
    borderRadius: "8px",
    overflow: "hidden",
    gridTemplateColumns: count === 1 ? "1fr" : "1fr 1fr",
    gridTemplateRows: count >= 3 ? "1fr 1fr" : undefined,
    aspectRatio: count === 2 ? "16/9" : count === 3 ? "4/3" : "1/1",
  };

  return (
    <div style={gridStyle}>
      <Image.PreviewGroup>
        {visible.map((item, index) => {
          const isVideo = item.type === "video";

          // VIDEO
          if (isVideo) {
            return (
              <div key={index} style={{ position: "relative" }}>
                <video
                  src={item.src}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  controls
                />
              </div>
            );
          }

          // IMAGE (cũ giữ nguyên)
          return (
            <Image
              key={index}
              src={item.src}
              style={imgStyle}
              wrapperStyle={{ display: "block", height: "100%" }}
            />
          );
        })}

        {/* Hidden images để preview */}
        {hidden.length > 0 && (
          <div
            style={{
              height: 0,
              overflow: "hidden",
              visibility: "hidden",
              position: "absolute",
            }}
          >
            {hidden
              .filter((m) => m.type === "image")
              .map((m, index) => (
                <Image src={m.src} key={`hidden-${index}`} />
              ))}
          </div>
        )}
      </Image.PreviewGroup>
    </div>
  );
};
export default PostImages;