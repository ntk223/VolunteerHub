# 🌟 VolunteerHub

> **A comprehensive volunteer community platform**  
> Web Application Development Course Final Project

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.18-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://mysql.com/)

## 📖 Overview

**VolunteerHub** is a comprehensive web platform that connects charitable organizations, event managers, and volunteers. The system provides a social interaction environment for sharing experiences, recruiting volunteers, and managing charitable activities efficiently.

## ✨ Key Features

### 👥 User Management
- **Registration/Login** with JWT authentication
- **3 account types**: Admin, Manager, User (Volunteer)
- **Profile management** with avatar upload and personal information
- **Role-based** access control

### 📝 Social Post System
- **Create posts** with multiple types: Discussion, Volunteer Recruitment, Experience Sharing
- **Interactions**: Like, Comment with multi-level replies
- **Media upload**: Support for images and videos with cloud storage
- **Post sorting**: By time or popularity
- **Smart search and filtering** for posts

### 📅 Event Management
- **Create events** with detailed information and images
- **Manage volunteer applications**
- **Track event progress**
- **Admin approval system** for events

### 🛠 Admin Dashboard
- **Comprehensive statistics** with visual charts
- **User management**: Lock/unlock accounts
- **Content moderation**: Posts and events
- **Detailed Excel reports** export
- **Advanced filtering and search**

### 🎨 Interface and UX
- **Responsive design** compatible with all devices
- **Ant Design** for professional UI components
- **Custom theme** with consistent colors
- **Smooth animations and transitions**

## 🏗 System Architecture

### Frontend (React)
```
FE/
├── src/
│   ├── components/          # UI Components
│   │   ├── admin/          # Admin Dashboard
│   │   ├── auth/           # Authentication
│   │   ├── common/         # Shared components
│   │   ├── layout/         # Layout components
│   │   └── post/           # Post components
│   ├── contexts/           # React Context
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── styles/             # CSS styles
│   └── utils/              # Utility functions
```

### Backend (Node.js + Express)
```
BE/
├── config/                 # Database & Environment config
├── controllers/            # Route controllers
├── middlewares/            # Authentication & validation
├── models/                 # Database models (Sequelize)
├── repositories/           # Data access layer
├── routes/                 # API routes
├── services/               # Business logic
├── utils/                  # Helper functions
└── validators/             # Input validation
```

## 🚀 Installation and Setup

### System Requirements
- **Node.js** >= 18.0
- **MySQL** >= 8.0
- **npm** or **yarn**

### 1. Clone Repository
```bash
git clone https://github.com/ntk223/VolunteerHub.git
cd VolunteerHub
```

### 2. Backend Setup
```bash
cd BE
npm install

# Create .env file and configure database
cp .env.example .env
# Edit database information in .env

# Run migrations and seed data
npm run migrate
npm run seed

# Start server
npm start
# Server runs at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd FE
npm install

# Start development server
npm run dev
# Frontend runs at http://localhost:5173
```

## 🗄 Database Schema

### Main Tables:
- **Users**: User information and role management
- **Posts**: Posts with different types
- **Comments**: Multi-level comment system
- **Likes**: Likes for posts and comments
- **Events**: Volunteer event information
- **Applications**: Event participation applications
- **Categories**: Event categories
- **Managers**: Event manager information

## 📊 Featured Capabilities

### 🔍 Smart Search
- Search by keyword, post type, author
- Multi-criteria filtering with intuitive UI
- Pagination and automatic load more

### 📈 Analytics Dashboard
- Statistical charts for users, posts, events
- Monthly content creation trend tracking
- Top contributors and engagement metrics

### 🔐 Security
- JWT authentication with refresh token
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control

### 📱 Mobile Responsive
- Optimized layout for mobile and tablet
- Touch-friendly UI components
- Progressive Web App ready

## 🛠 Technology Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **Ant Design** - UI Component library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - MySQL ORM
- **JWT** - Authentication
- **Multer** - File upload
- **Joi** - Data validation

### Tools & DevOps
- **MySQL** - Primary database
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 👨‍💻 Author

**Development Team:**
- **Nguyen Trung Kien** - Full-stack Developer
- *Web Application Development Course Final Project*

## 📞 Contact

- **Email**: kienlx2005@gmail.com
- **GitHub**: [ntk223](https://github.com/ntk223)
- **Repository**: [VolunteerHub](https://github.com/ntk223/VolunteerHub)

## 📄 License

This project is developed for educational purposes and has no commercial license.

---

⭐ **If you find this project useful, please give it a star!** ⭐
