import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Xuất thống kê tổng quan
export const exportStatisticsToExcel = (users, posts, events) => {
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Tổng quan
  const overviewData = [
    ['Loại thống kê', 'Số lượng'],
    ['Tổng người dùng', users.length],
    ['Tổng bài viết', posts.length],
    ['Tổng sự kiện', events.length],
    ['Bài viết chờ duyệt', posts.filter(p => p.status === 'pending').length],
    ['Bài viết đã duyệt', posts.filter(p => p.status === 'approved').length],
    ['Bài viết từ chối', posts.filter(p => p.status === 'rejected').length],
    ['Sự kiện chờ duyệt', events.filter(e => e.approvalStatus === 'pending').length],
    ['Sự kiện đã duyệt', events.filter(e => e.approvalStatus === 'approved').length],
    ['Sự kiện từ chối', events.filter(e => e.approvalStatus === 'rejected').length],
  ];
  
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Tổng quan');
  
  // Sheet 2: Thống kê bài viết theo loại
  const postTypeCounts = posts.reduce((acc, p) => {
    const type = getPostTypeLabel(p.postType);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const postTypeData = [
    ['Loại bài viết', 'Số lượng'],
    ...Object.entries(postTypeCounts)
  ];
  
  const postTypeSheet = XLSX.utils.aoa_to_sheet(postTypeData);
  XLSX.utils.book_append_sheet(workbook, postTypeSheet, 'Bài viết theo loại');
  
  // Sheet 3: Top người dùng đăng nhiều bài
  const topUsers = users.map(user => {
    const postCount = posts.filter(p => p.author?.id === user.id).length;
    return [user.name, user.email, postCount, user.role, user.status];
  }).sort((a, b) => b[2] - a[2]);
  
  const topUsersData = [
    ['Tên người dùng', 'Email', 'Số bài viết', 'Vai trò', 'Trạng thái'],
    ...topUsers
  ];
  
  const topUsersSheet = XLSX.utils.aoa_to_sheet(topUsersData);
  XLSX.utils.book_append_sheet(workbook, topUsersSheet, 'Top người dùng');
  
  // Xuất file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, `Thong_ke_tong_quan_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
};

// Xuất danh sách người dùng
export const exportUsersToExcel = (users) => {
  const userData = users.map(user => ({
    'Tên': user.name,
    'Email': user.email,
    'Số điện thoại': user.phone || 'Chưa cập nhật',
    'Vai trò': user.role,
    'Trạng thái': user.status === 'active' ? 'Hoạt động' : 'Bị khóa',
    'Ngày tạo': user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(userData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách người dùng');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, `Danh_sach_nguoi_dung_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
};

// Xuất danh sách bài viết
export const exportPostsToExcel = (posts) => {
  const postData = posts.map(post => ({
    'ID': post.id,
    'Tác giả': post.author?.name || 'N/A',
    'Email tác giả': post.author?.email || 'N/A',
    'Loại bài viết': getPostTypeLabel(post.postType),
    'Nội dung': post.content?.replace(/\n/g, ' ').substring(0, 100) + (post.content?.length > 100 ? '...' : ''),
    'Lượt thích': post.likeCount || 0,
    'Số bình luận': post.commentCount || 0,
    'Trạng thái': getStatusLabel(post.status),
    'Ngày tạo': post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(postData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách bài viết');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, `Danh_sach_bai_viet_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
};

// Xuất danh sách sự kiện
export const exportEventsToExcel = (events) => {
  const eventData = events.map(event => ({
    'ID': event.id,
    'Tên sự kiện': event.title,
    'Người tạo': event.manager?.user?.name || 'N/A',
    'Danh mục': event.category?.name || 'N/A',
    'Địa điểm': event.location || 'N/A',
    'Thời gian bắt đầu': event.startTime ? new Date(event.startTime).toLocaleString('vi-VN') : 'N/A',
    'Thời gian kết thúc': event.endTime ? new Date(event.endTime).toLocaleString('vi-VN') : 'N/A',
    'Trạng thái duyệt': getStatusLabel(event.approvalStatus),
    'Tiến trình': getProgressLabel(event.progressStatus),
    'Ngày tạo': event.createdAt ? new Date(event.createdAt).toLocaleDateString('vi-VN') : 'N/A'
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(eventData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách sự kiện');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, `Danh_sach_su_kien_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
};

// Helper functions
const getPostTypeLabel = (type) => {
  switch (type) {
    case 'discussion': return 'Thảo luận';
    case 'volunteer_recruitment': return 'Tuyển tình nguyện viên';
    case 'experience_sharing': return 'Chia sẻ kinh nghiệm';
    default: return type || 'Không xác định';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending': return 'Chờ duyệt';
    case 'approved': return 'Đã duyệt';
    case 'rejected': return 'Từ chối';
    default: return 'Không xác định';
  }
};

const getProgressLabel = (status) => {
  switch (status) {
    case 'completed': return 'Hoàn thành';
    case 'incomplete': return 'Chưa hoàn thành';
    case 'cancelled': return 'Đã hủy';
    default: return 'Không xác định';
  }
};