# 🚀 Hướng dẫn cài đặt và chạy VolunteerHub

## 📋 Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

- **Node.js**: Version 18.0 trở lên ([Tải tại đây](https://nodejs.org/))
- **MySQL**: Version 8.0 trở lên ([Tải tại đây](https://dev.mysql.com/downloads/mysql/))
- **npm** hoặc **yarn**: Package manager (đi kèm với Node.js)
- **Git**: Để clone repository ([Tải tại đây](https://git-scm.com/))

## 📥 Bước 1: Clone Repository

```bash
git clone https://github.com/ntk223/VolunteerHub.git
cd VolunteerHub
```

## 🗄️ Bước 2: Cấu hình Database (MySQL)

### 2.1. Tạo Database

Mở MySQL Workbench hoặc terminal MySQL và chạy:

```sql
CREATE DATABASE volunteerhub;
```

### 2.2. Import Database Schema

```bash
# Từ thư mục gốc của project
mysql -u root -p volunteerhub < database/schema.sql
```

Hoặc import file SQL qua MySQL Workbench:
- File → Open SQL Script → Chọn `database/schema.sql`
- Execute

### 2.3. (Tùy chọn) Import dữ liệu mẫu

```bash
mysql -u root -p volunteerhub < database/seed.sql
```

## ⚙️ Bước 3: Cấu hình Backend (BE)

### 3.1. Di chuyển vào thư mục Backend

```bash
cd BE
```

### 3.2. Cài đặt Dependencies

```bash
npm install
```

### 3.3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `BE`:

```bash
touch .env
```

Thêm nội dung sau vào file `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=volunteerhub
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration (cho upload ảnh)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis Configuration (nếu có)
REDIS_HOST=localhost
REDIS_PORT=6379
```

**⚠️ Lưu ý:**
- Thay `your_mysql_password` bằng mật khẩu MySQL của bạn
- Thay `your_super_secret_jwt_key_here` bằng một chuỗi bí mật mạnh
- Đăng ký tài khoản [Cloudinary](https://cloudinary.com/) miễn phí để lấy thông tin cấu hình upload ảnh

### 3.4. Chạy Backend Server

```bash
npm run dev
```

✅ Backend sẽ chạy tại: `http://localhost:5000`

### 3.5. Kiểm tra Backend

Mở trình duyệt và truy cập:
- API Documentation: `http://localhost:5000/api-docs` (nếu có Swagger)
- Health Check: `http://localhost:5000/api/health`

## 🎨 Bước 4: Cấu hình Frontend (FE)

### 4.1. Mở terminal mới và di chuyển vào thư mục Frontend

```bash
# Từ thư mục gốc
cd FE
```

### 4.2. Cài đặt Dependencies

```bash
npm install
```

### 4.3. Cấu hình Environment Variables

### 4.4. Chạy Frontend Development Server

```bash
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:3000` (hoặc cổng khác nếu 3000 đã được sử dụng)

## 🌐 Bước 5: Truy cập ứng dụng

Mở trình duyệt và truy cập: **`http://localhost:3000`**
### Tài khoản mặc định (nếu có dữ liệu mẫu):

**Admin:**
- Email: `kk@gmail.com`
- Password: `123456`

**Manager:**
- Email: `kk@gmail.com`
- Password: `123456`

**Volunteer:**
- Email: `kk@gmail.com`
- Password: `1234567`

## 🔧 Các lệnh hữu ích

### Backend (BE)

```bash
# Chạy development mode với nodemon (auto-restart)
npm run dev

# Chạy production mode
npm start

# Kiểm tra lỗi code
npm run lint
```

### Frontend (FE)

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview bản build
npm run preview

# Kiểm tra lỗi code
npm run lint
```

## 🐛 Xử lý sự cố thường gặp

### 1. Lỗi kết nối Database

**Triệu chứng:** `ER_ACCESS_DENIED_ERROR` hoặc `ECONNREFUSED`

**Giải pháp:**
- Kiểm tra MySQL đã được khởi động chưa
- Xác nhận username/password trong file `.env` đúng
- Kiểm tra database `volunteerhub` đã được tạo

```bash
# Kiểm tra MySQL đang chạy (Linux/Mac)
sudo systemctl status mysql

# Hoặc (Windows)
services.msc -> Tìm MySQL
```

### 2. Lỗi Port đã được sử dụng

**Triệu chứng:** `EADDRINUSE: address already in use :::5000`

**Giải pháp:**
```bash
# Tìm và dừng process đang sử dụng port
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Hoặc thay đổi PORT trong `.env`:
```env
PORT=5001
```

### 3. Lỗi CORS

**Triệu chứng:** `Access-Control-Allow-Origin` error trong console

**Giải pháp:** Kiểm tra file `BE/config/cors.js` đã bao gồm URL frontend:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];
```

### 4. Module not found

**Triệu chứng:** `Cannot find module 'xxx'`

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Hoặc dùng cache clean
npm cache clean --force
npm install
```

### 5. Cloudinary upload lỗi

**Triệu chứng:** Không upload được ảnh

**Giải pháp:**
- Kiểm tra thông tin Cloudinary trong `.env` đúng
- Đăng nhập vào [Cloudinary Dashboard](https://cloudinary.com/console) để lấy credentials
- Test API key tại Settings → Security

## 📦 Build cho Production

### Backend

```bash
cd BE
# Backend chỉ cần copy files và cài dependencies
npm install --production
NODE_ENV=production node server.js
```

### Frontend

```bash
cd FE
npm run build
# File build sẽ nằm trong thư mục dist/

# Preview build
npm run preview
```

## 🐳 Chạy với Docker (Tùy chọn)

Nếu có file `docker-compose.yml`:

```bash
# Từ thư mục gốc
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

## 📚 Tài liệu bổ sung

- [API Documentation](./docs/API.md) (nếu có)
- [Database Schema](./docs/DATABASE.md) (nếu có)
- [Contributing Guide](./CONTRIBUTING.md) (nếu có)

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra [Issues](https://github.com/ntk223/VolunteerHub/issues) trên GitHub
2. Tạo issue mới với mô tả chi tiết lỗi
3. Liên hệ: ntkien@example.com

## 📝 Ghi chú

- **Development**: Sử dụng `npm run dev` cho cả BE và FE
- **Production**: Build FE và serve với nginx/apache, chạy BE với PM2 hoặc systemd
- **Database Backup**: Định kỳ backup database với `mysqldump`
- **Environment Variables**: Không commit file `.env` lên Git (đã có trong `.gitignore`)

---

**Happy Coding! 🎉**

Nếu hướng dẫn này hữu ích, hãy ⭐ star repository trên GitHub!
