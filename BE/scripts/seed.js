import sequelize from "../config/database.js";
import Category from "../models/Category.js";
import Event from "../models/Event.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
const MANAGER_ID = 5; // Sử dụng managerId cố định cho tất cả các sự kiện được tạo
const USER_ID = 59; // Sử dụng userId cố định cho tất cả các bài đăng được tạo
const NUM_EVENTS = 100;
const NUM_RECRUITMENT_POSTS = 100;
const NUM_DISCUSS_POSTS = 50;
// Seed only Events and Posts
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting seeding Events and Posts...");

    // Clear existing data
    await Post.destroy({ where: {}, force: true });
    await Event.destroy({ where: {}, force: true });
    await Notification.destroy({ where: {}, force: true });
    console.log("✅ Cleared existing Events and Posts");

    // 1. Seed Events
    const eventsData = [];
    const categories = [1, 2, 3, 4, 5]; // Môi trường, Giáo dục, Y tế, Cứu trợ, Cộng đồng
    const approvalStatuses = ["approved", "pending"];
    
    for (let i = 1; i <= NUM_EVENTS; i++) {
      const categoryId = categories[(i - 1) % categories.length];
      const startDate = new Date(2025, 0, 15 + i); // Start from Jan 15, 2025
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // +4 hours
      
      eventsData.push({
        categoryId: categoryId,
        title: `Sự kiện tình nguyện test${i}`,
        description: `Đây là sự kiện test${i} với mô tả chi tiết về hoạt động tình nguyện. Chúng tôi cần tình nguyện viên nhiệt huyết tham gia.`,
        location: `Địa điểm test${i}, Hà Nội`,
        startTime: startDate,
        endTime: endDate,
        capacity: 50 + (i * 10),
        managerId: MANAGER_ID,
        approvalStatus: approvalStatuses[i % 2],
        progressStatus: "incomplete",
        imgUrl: `https://res.cloudinary.com/demo/image/upload/v1/event-test${i}.jpg`,
      });
    }
    
    const events = await Event.bulkCreate(eventsData);
    console.log(`✅ Seeded ${events.length} events`);

    // 2. Seed Posts
    const postsData = [];
    const postTypes = ["recruitment", "discuss"];
    const postStatuses = ["approved", "pending"];
    
    // Create posts with events (recruitment)
    for (let i = 1; i <= NUM_RECRUITMENT_POSTS; i++) {
      const eventIndex = i % events.length;
      postsData.push({
        eventId: events[eventIndex].id,
        authorId: USER_ID, // User ID 59
        postType: "recruitment",
        content: `📢 Tuyển tình nguyện viên cho sự kiện test${i}\n\nChúng tôi đang tìm kiếm các bạn nhiệt huyết tham gia hoạt động!\n\n✅ Yêu cầu: Có tinh thần trách nhiệm\n✅ Lợi ích: Được đào tạo và cấp chứng nhận\n\nĐăng ký ngay!`,
        status: postStatuses[i % 2],
        likeCount: i * 3,
        commentCount: i * 2,
        media: i % 3 === 0 ? [`https://res.cloudinary.com/demo/image/upload/v1/post-test${i}.jpg`] : [],
      });
    }
    
    // Create posts without events (discuss)
    for (let i = 1; i <= NUM_DISCUSS_POSTS; i++) {
      postsData.push({
        eventId: null,
        authorId: USER_ID, // User ID 59
        postType: "discuss",
        content: `Bài thảo luận test${i}: Chia sẻ kinh nghiệm tham gia hoạt động tình nguyện. Đây là nội dung test${i} với nhiều thông tin hữu ích cho mọi người.`,
        status: "approved",
        likeCount: i * 2,
        commentCount: i,
        media: [],
      });
    }
    
    const posts = await Post.bulkCreate(postsData);
    console.log(`✅ Seeded ${posts.length} posts`);

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Events: ${events.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log("\n💡 Note: Make sure Categories and Users exist in database before running this script.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();