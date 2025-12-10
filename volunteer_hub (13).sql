-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Dec 10, 2025 at 09:25 AM
-- Server version: 8.4.6
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `volunteer_hub`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` bigint NOT NULL,
  `event_id` bigint NOT NULL,
  `volunteer_id` bigint NOT NULL,
  `status` enum('pending','approved','rejected','attended') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `applied_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `approved_at` datetime DEFAULT NULL,
  `is_cancelled` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `event_id`, `volunteer_id`, `status`, `applied_at`, `approved_at`, `is_cancelled`) VALUES
(1, 10, 2, 'approved', '2025-10-21 08:41:40', NULL, 0),
(3, 2, 8, 'pending', '2025-11-30 23:51:13', NULL, 0),
(7, 50, 8, 'approved', '2025-12-01 00:02:31', NULL, 0),
(17, 54, 8, 'attended', '2025-12-09 17:14:36', NULL, 0),
(18, 55, 8, 'attended', '2025-12-09 21:51:13', NULL, 0),
(19, 53, 8, 'pending', '2025-12-09 22:06:10', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`) VALUES
(1, 'Môi trường', 'Các hoạt động bảo vệ môi trường và thiên nhiên.'),
(2, 'Giáo dục', 'Các chương trình dạy học, hỗ trợ học sinh, sinh viên.'),
(3, 'Cộng đồng', 'Các hoạt động giúp đỡ cộng đồng, người yếu thế.'),
(4, 'Y tế', 'Các chương trình chăm sóc sức khỏe cộng đồng.'),
(5, 'Văn hóa - Nghệ thuật', 'Sự kiện giao lưu văn hóa, nghệ thuật, âm nhạc.');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  `author_id` bigint NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `author_id`, `content`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 52, '123123', '2025-10-16 14:16:16', '2025-10-16 14:16:16', NULL),
(2, 1, 44, 'adasdsad', '2025-10-16 14:35:24', '2025-10-16 14:35:24', NULL),
(4, 1, 52, 'abc', '2025-10-21 08:56:33', '2025-10-21 08:56:33', NULL),
(5, 1, 52, 'abc', '2025-10-21 08:58:33', '2025-10-21 08:58:33', NULL),
(6, 1, 46, 'tôi tên là nguyễn trung kiên', '2025-10-25 20:36:21', '2025-10-25 20:36:21', NULL),
(7, 1, 46, 'alo', '2025-10-29 22:36:46', '2025-10-29 22:36:46', NULL),
(8, 1, 46, 'kine', '2025-10-31 21:19:48', '2025-10-31 21:19:48', NULL),
(9, 1, 46, 'hello', '2025-10-31 22:59:29', '2025-10-31 22:59:29', NULL),
(10, 2, 46, 'hello', '2025-10-31 23:07:41', '2025-10-31 23:07:41', NULL),
(11, 1, 46, 'kiennn', '2025-10-31 23:09:41', '2025-10-31 23:09:41', NULL),
(12, 1, 46, 'kiennn', '2025-10-31 23:11:43', '2025-10-31 23:11:43', NULL),
(13, 1, 46, 'kiennn', '2025-10-31 23:12:13', '2025-10-31 23:12:13', NULL),
(14, 1, 46, 'kiennn', '2025-10-31 23:12:32', '2025-10-31 23:12:32', NULL),
(15, 1, 46, 'ádasd', '2025-10-31 23:12:45', '2025-10-31 23:12:45', NULL),
(16, 2, 54, 'toi yeu nguyet', '2025-11-04 13:52:44', '2025-11-04 13:52:44', NULL),
(17, 2, 46, 'okokoko', '2025-11-09 00:57:12', '2025-11-09 00:57:12', NULL),
(18, 5, 46, 'hello\n', '2025-11-09 14:37:03', '2025-11-09 14:37:03', NULL),
(19, 1, 46, 'asdasd', '2025-11-09 14:37:19', '2025-11-09 14:37:19', NULL),
(20, 1, 46, 'asdasd', '2025-11-09 14:41:23', '2025-11-09 14:41:23', NULL),
(21, 6, 55, 'chào', '2025-11-09 17:04:40', '2025-11-09 17:04:40', NULL),
(22, 6, 55, 'hello', '2025-11-10 16:31:10', '2025-11-10 16:31:10', NULL),
(23, 7, 55, 'xin chào', '2025-11-10 16:43:09', '2025-11-10 16:43:09', NULL),
(24, 19, 55, 'alo alo', '2025-11-11 21:39:39', '2025-11-15 17:59:31', NULL),
(25, 19, 55, 'helloooadsasds', '2025-11-11 21:40:12', '2025-11-17 16:46:04', NULL),
(26, 19, 55, 'aaaaa', '2025-11-12 17:49:10', '2025-11-12 17:49:10', NULL),
(27, 3, 59, 'tôi mướn ứng tuyển', '2025-11-15 16:28:58', '2025-11-15 16:28:58', NULL),
(28, 18, 58, 'xin chao tôi tên là kiên', '2025-11-15 17:55:41', '2025-11-15 17:58:33', '2025-11-15 17:58:33'),
(29, 9, 55, '1', '2025-11-15 18:09:00', '2025-11-15 18:09:00', NULL),
(30, 9, 55, '1', '2025-11-15 18:09:46', '2025-11-15 18:09:46', NULL),
(31, 20, 55, 'a', '2025-11-17 16:18:02', '2025-11-17 16:26:02', '2025-11-17 16:26:02'),
(32, 3, 55, 'asdasd', '2025-11-17 16:19:40', '2025-11-17 16:19:40', NULL),
(33, 20, 55, 'a', '2025-11-17 16:20:28', '2025-11-17 16:20:28', NULL),
(34, 20, 55, 'a', '2025-11-17 16:20:30', '2025-11-17 16:20:30', NULL),
(35, 3, 55, 'a', '2025-11-17 16:21:39', '2025-11-17 16:21:39', NULL),
(36, 3, 55, 'a', '2025-11-17 16:21:41', '2025-11-17 16:21:41', NULL),
(37, 20, 55, 'a', '2025-11-17 16:24:14', '2025-11-17 16:24:14', NULL),
(38, 20, 55, 'a', '2025-11-17 16:24:16', '2025-11-17 16:24:16', NULL),
(39, 20, 55, 'a', '2025-11-17 16:28:43', '2025-11-17 16:28:43', NULL),
(40, 3, 55, 'a', '2025-11-17 16:28:52', '2025-11-17 16:28:52', NULL),
(41, 3, 55, 'a', '2025-11-17 16:28:54', '2025-11-17 16:28:54', NULL),
(42, 21, 58, 'xin chào', '2025-12-09 18:33:07', '2025-12-09 18:33:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category_id` int DEFAULT NULL,
  `location` text,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `manager_id` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `published_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `approval_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `progress_status` enum('incomplete','completed','cancelled') DEFAULT 'incomplete',
  `img_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `category_id`, `location`, `start_time`, `end_time`, `capacity`, `manager_id`, `created_at`, `published_at`, `deleted_at`, `updated_at`, `approval_status`, `progress_status`, `img_url`) VALUES
(1, 'Dọn rác bãi biển Đà Nẵng', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 1, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 11:30:00', 100, 2, '2025-10-11 10:51:19', '2025-11-10 23:14:07', NULL, '2025-11-10 23:14:07', 'approved', 'incomplete', NULL),
(2, 'Lớp học miễn phí cho trẻ em nghèo', 'Tổ chức lớp học Toán và Tiếng Việt cho học sinh tiểu học vùng khó khăn.', 2, 'Xã Tân Lập, Huyện Mộc Châu, Sơn La', '2025-12-01 08:00:00', '2025-12-15 17:00:00', 50, 2, '2025-10-11 10:51:19', NULL, NULL, '2025-12-09 09:46:01', 'approved', 'completed', NULL),
(3, 'Hiến máu nhân đạo mùa xuân', 'Sự kiện hiến máu cứu người do Hội Chữ thập đỏ tổ chức.', 4, 'Trung tâm Hội nghị Quốc gia, Hà Nội', '2025-03-05 08:00:00', '2025-03-05 12:00:00', 300, 2, '2025-10-11 10:51:19', '2025-12-10 15:08:50', NULL, '2025-12-10 15:08:50', 'approved', 'incomplete', NULL),
(4, 'Chương trình giao lưu văn nghệ', 'Buổi biểu diễn âm nhạc và múa dân gian gây quỹ từ thiện.', 5, 'Nhà văn hóa Thanh Xuân, Hà Nội', '2025-10-25 18:00:00', '2025-10-25 21:00:00', 200, 2, '2025-10-11 10:51:19', '2025-10-11 10:51:19', NULL, NULL, 'pending', 'incomplete', NULL),
(5, 'Tặng quà cho người già neo đơn', 'Hoạt động trao quà, thăm hỏi người già có hoàn cảnh khó khăn.', 3, 'Trung tâm bảo trợ xã hội Quận 9, TP.HCM', '2025-12-20 09:00:00', '2025-12-20 11:00:00', 80, 2, '2025-10-11 10:51:19', '2025-10-11 10:51:19', NULL, NULL, 'pending', 'incomplete', NULL),
(6, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 11:30:00', 10, 2, '2025-10-11 15:46:33', NULL, NULL, '2025-10-12 23:55:23', 'approved', 'incomplete', NULL),
(7, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 04:30:00', 10, 2, '2025-10-11 15:48:26', NULL, NULL, '2025-10-11 15:48:26', 'pending', 'incomplete', NULL),
(8, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:00:00', '2025-11-10 04:30:00', 10, 2, '2025-10-11 15:48:44', NULL, NULL, '2025-10-12 23:59:03', 'approved', 'incomplete', NULL),
(9, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 04:30:00', 10, 2, '2025-10-11 15:49:02', NULL, '2025-10-12 17:30:17', '2025-10-12 17:30:17', 'pending', 'incomplete', NULL),
(10, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 04:30:00', 10, 2, '2025-10-11 15:49:19', NULL, NULL, '2025-10-11 15:49:19', 'pending', 'incomplete', NULL),
(11, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 11:30:00', 10, 2, '2025-10-11 15:56:49', NULL, NULL, '2025-10-11 15:56:49', 'pending', 'incomplete', NULL),
(12, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 11:30:00', 10, 2, '2025-10-11 15:56:50', NULL, NULL, '2025-10-11 15:56:50', 'pending', 'incomplete', NULL),
(13, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 11:30:00', 10, 2, '2025-10-11 15:57:02', NULL, NULL, '2025-10-11 15:57:02', 'pending', 'incomplete', NULL),
(14, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 15:57:22', NULL, NULL, '2025-10-11 15:57:22', 'pending', 'incomplete', NULL),
(15, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 16:09:40', NULL, NULL, '2025-10-11 16:09:40', 'pending', 'incomplete', NULL),
(16, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:22:24', NULL, NULL, '2025-10-11 16:22:24', 'pending', 'incomplete', NULL),
(17, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:22:33', NULL, NULL, '2025-10-11 16:22:33', 'pending', 'incomplete', NULL),
(18, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:23:57', NULL, NULL, '2025-10-11 16:23:57', 'pending', 'incomplete', NULL),
(19, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:25:15', NULL, NULL, '2025-10-11 16:25:15', 'pending', 'incomplete', NULL),
(20, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:27:26', NULL, '2025-10-12 18:49:17', '2025-10-12 18:49:17', 'pending', 'incomplete', NULL),
(21, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:27:27', NULL, NULL, '2025-10-11 16:27:27', 'pending', 'incomplete', NULL),
(22, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 16:29:25', NULL, NULL, '2025-10-11 16:29:25', 'pending', 'incomplete', NULL),
(23, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:46:59', NULL, NULL, '2025-11-09 21:37:07', 'rejected', 'incomplete', NULL),
(24, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:47:04', '2025-10-13 00:03:08', '2025-11-09 21:34:20', '2025-11-09 21:34:20', 'approved', 'completed', NULL),
(25, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:47:20', NULL, NULL, '2025-11-09 21:33:41', 'rejected', 'incomplete', NULL),
(26, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:50:11', NULL, NULL, '2025-10-11 23:50:11', 'pending', 'incomplete', NULL),
(27, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:50:13', NULL, NULL, '2025-10-11 23:50:13', 'pending', 'incomplete', NULL),
(28, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:51:57', NULL, NULL, '2025-11-30 22:16:34', 'rejected', 'incomplete', NULL),
(29, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:52:13', NULL, NULL, '2025-10-11 16:52:13', 'pending', 'incomplete', NULL),
(30, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:52:15', NULL, NULL, '2025-10-11 16:52:15', 'pending', 'incomplete', NULL),
(31, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:54:01', NULL, NULL, '2025-10-11 23:54:01', 'pending', 'incomplete', NULL),
(32, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:54:39', NULL, NULL, '2025-10-11 23:54:39', 'pending', 'incomplete', NULL),
(33, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 16:55:49', NULL, NULL, '2025-10-11 16:55:49', 'pending', 'incomplete', NULL),
(34, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-11 23:56:52', NULL, NULL, '2025-10-11 23:56:52', 'pending', 'incomplete', NULL),
(35, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 17:02:02', NULL, NULL, '2025-10-11 17:02:02', 'pending', 'incomplete', NULL),
(36, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 17:02:04', NULL, NULL, '2025-10-11 17:02:04', 'pending', 'incomplete', NULL),
(37, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 17:02:06', NULL, NULL, '2025-10-11 17:02:06', 'pending', 'incomplete', NULL),
(38, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 17:02:18', NULL, NULL, '2025-10-11 17:02:18', 'pending', 'incomplete', NULL),
(39, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 00:30:00', '2025-11-10 05:30:00', 10, 2, '2025-10-11 17:02:20', NULL, NULL, '2025-10-11 17:02:20', 'pending', 'incomplete', NULL),
(40, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-12 00:03:49', NULL, NULL, '2025-10-12 00:03:49', 'pending', 'incomplete', NULL),
(41, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-12 00:04:24', NULL, NULL, '2025-10-12 00:04:24', 'pending', 'incomplete', NULL),
(42, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-12 00:05:45', NULL, NULL, '2025-10-12 00:05:45', 'pending', 'incomplete', NULL),
(43, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-12 00:08:02', NULL, NULL, '2025-10-12 00:08:02', 'pending', 'incomplete', NULL),
(44, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-12 00:09:13', NULL, '2025-11-09 21:36:47', '2025-11-09 21:36:47', 'rejected', 'incomplete', NULL),
(45, 'Test', 'Chiến dịch làm sạch bãi biển và nâng cao ý thức bảo vệ môi trường cho người dân địa phương.', 2, 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-11-10 07:30:00', '2025-11-10 12:30:00', 10, 2, '2025-10-12 00:11:06', NULL, NULL, '2025-10-12 00:11:06', 'pending', 'incomplete', NULL),
(47, 'don rac', 'don rac', 1, 'ha Noi', '2025-11-10 07:30:00', '2025-11-10 08:30:00', 112, 2, '2025-10-12 17:00:43', NULL, NULL, '2025-10-12 17:00:43', 'pending', 'incomplete', NULL),
(48, 'aaaaa', 'ádasd', 3, 'Hà Nội', '2025-10-19 08:09:09', '2025-10-23 15:09:10', 100, 2, '2025-10-19 08:10:35', NULL, '2025-11-09 21:34:58', '2025-11-09 21:34:58', 'approved', 'incomplete', NULL),
(49, 'hoat dong tu thien', 'hoat dong tu thien', 3, 'cau giay, ha noi', '2025-11-12 09:27:37', '2025-11-12 20:27:38', 10, 3, '2025-11-12 09:28:44', '2025-11-12 16:29:38', NULL, '2025-11-12 16:29:38', 'approved', 'incomplete', NULL),
(50, 'tesst', 'asfkjhasdjkfhasjkfdhaskjlh', 1, 'dai hoc quoc gia ha noi', '2025-11-15 04:04:05', '2025-11-15 08:08:08', 20, 5, '2025-11-15 16:18:49', NULL, NULL, '2025-11-15 09:33:08', 'approved', 'incomplete', NULL),
(51, 'adfgsdg', 'sgdfgdsfg', 1, 'Tầng 3, Tòa nhà A, Quận Ba Đình', '2025-11-21 00:00:00', '2025-11-21 00:04:00', 12, 5, '2025-11-20 16:52:17', NULL, '2025-12-09 23:17:41', '2025-12-09 23:17:41', 'pending', 'incomplete', NULL),
(52, 'adfasfasdf', 'adfadsfa', 2, 'Tầng 3, Tòa nhà A, Quận Ba Đình', '2025-10-04 00:00:00', '2025-10-04 00:00:04', 123, 5, '2025-11-22 15:56:25', NULL, NULL, '2025-12-09 23:22:01', 'pending', 'incomplete', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765291797/volunteerhub/image/nkxobxi8tozzjqzgadyr.png'),
(53, '123123', '123123123', 1, 'Đường Lai Xá, Hoai Duc Commune, Hà Nội, Vietnam', '2025-11-27 00:00:00', '2025-11-27 06:00:00', 12, 5, '2025-11-30 21:33:27', '2025-11-30 21:34:39', NULL, '2025-12-09 23:33:20', 'approved', 'cancelled', NULL),
(54, '12213312', '12123123', 5, 'đại học quốc gia hà nội', '2025-12-16 00:00:00', '2025-12-26 00:00:00', 9, 5, '2025-12-09 16:36:38', '2025-12-09 16:37:47', NULL, '2025-12-09 22:05:08', 'approved', 'completed', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765272993/volunteerhub/image/r3vsr8b2qixsfj3woumr.png'),
(55, 'sinh vien tinh nguyen', 'sinh vien tinh nguyen', 5, 'Đại học Quốc gia Hà Nội, 144, Đường Xuân Thủy, Phường Cầu Giấy, Hà Nội, 11314, Việt Nam', '2025-12-09 04:04:05', '2025-12-09 23:00:00', 12, 5, '2025-12-09 21:50:29', '2025-12-09 21:50:55', NULL, '2025-12-09 21:52:03', 'approved', 'completed', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765291797/volunteerhub/image/nkxobxi8tozzjqzgadyr.png'),
(56, '123123', '123123123', 1, 'Trường Tiểu học Kim Chung B, Đường Tây Lai Xá, Xã Hoài Đức, Hà Nội, Việt Nam', '2025-12-10 00:02:00', '2025-12-10 04:03:00', 10, 5, '2025-12-10 00:37:43', '2025-12-10 00:38:31', NULL, '2025-12-10 00:38:31', 'approved', 'incomplete', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765291797/volunteerhub/image/nkxobxi8tozzjqzgadyr.png'),
(57, 'qwe', 'qweqwe', 4, 'Vietnam National University, Hanoi, 144, Xuan Thuy Road, Cau Giay Ward, Hà Nội, 11314, Vietnam', '2025-12-15 00:04:07', '2025-12-15 16:00:00', 12, 5, '2025-12-10 15:00:12', NULL, NULL, '2025-12-10 15:00:12', 'pending', 'incomplete', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765353580/volunteerhub/image/vs7njvcolk5rh7l0nwsh.png');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` bigint NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `file_type` enum('image','video','document') NOT NULL,
  `uploaded_by` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `file_name`, `url`, `file_type`, `uploaded_by`, `created_at`) VALUES
(2, 'Screenshot from 2025-11-07 14-23-44.png', 'https://res.cloudinary.com/dpcrzajx2/raw/upload/v1762531116/volunteerhub/image/ozouhjsybp27gbs6mdcv', 'image', 46, '2025-11-07 22:58:37'),
(3, '23021590_NguyenTrungKien_T3.pdf', 'https://res.cloudinary.com/dpcrzajx2/raw/upload/v1762531429/volunteerhub/document/lnnzvmemvyndozaed7dm', 'image', 46, '2025-11-07 23:03:50'),
(4, 'mynft.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762531523/volunteerhub/image/xpxjtnxpuxhxjhgmh7jg.png', 'image', 46, '2025-11-07 23:05:24'),
(5, 'Screenshot from 2025-10-26 22-07-29.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762533251/volunteerhub/image/wmuareg0ztazcb3jahxi.png', 'image', 46, '2025-11-07 23:34:12'),
(6, 'Screenshot from 2025-10-21 00-15-26.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762533851/volunteerhub/image/tgnxc25y6s1uy19mwxf8.png', 'image', 46, '2025-11-07 23:44:12'),
(7, 'Screenshot from 2025-11-04 15-17-11.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762534020/volunteerhub/image/vvzd4o5i3tlwqqzkbjpa.png', 'image', 46, '2025-11-07 23:47:00'),
(8, 'Screenshot from 2025-10-07 17-16-05.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762534103/volunteerhub/image/scotdz8jej221pfawboa.png', 'image', 46, '2025-11-07 23:48:24'),
(9, 'Screenshot from 2025-11-05 22-57-36.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762534536/volunteerhub/image/t2aq1t8vkkmqkduncgap.png', 'image', 46, '2025-11-07 23:55:37'),
(10, 'Screenshot from 2025-11-04 13-37-39.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762534873/volunteerhub/image/zueot92g5bibb1rivvcd.png', 'image', 46, '2025-11-08 00:01:15'),
(11, 'Screenshot from 2025-10-28 18-12-04.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762535111/volunteerhub/image/ctmhclxrgt3zokapodcb.png', 'image', 46, '2025-11-08 00:05:13'),
(12, 'Screenshot from 2025-11-07 01-00-59.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762535261/volunteerhub/image/kkxded7aisdckij4gvdh.png', 'image', 46, '2025-11-08 00:07:41'),
(13, 'Screenshot from 2025-11-05 21-51-32.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762536046/volunteerhub/image/plwchcscwkz3wy2tagrn.png', 'image', 52, '2025-11-08 00:20:47'),
(14, 'Screenshot from 2025-11-05 22-34-59.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762536966/volunteerhub/image/j5prf9l091oolk7io2yh.png', 'image', 52, '2025-11-08 00:36:07'),
(15, 'Screenshot from 2025-11-05 22-57-42.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762537332/volunteerhub/image/mfjj6oo6mw6ff5v9pb3n.png', 'image', 52, '2025-11-08 00:42:13'),
(16, 'Screenshot from 2025-10-31 18-12-59.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762675405/volunteerhub/image/sd9igozqu12px7vdt2y7.png', 'image', 55, '2025-11-09 15:03:26'),
(17, 'Screenshot from 2025-11-15 16-56-07.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763203578/volunteerhub/image/vzh0u9uffpfyvswyasxg.png', 'image', 58, '2025-11-15 17:46:18'),
(18, 'Screenshot from 2025-11-15 15-59-27.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763220555/volunteerhub/image/ezac4ctsiphcspw9zmua.png', 'image', 55, '2025-11-15 22:29:16'),
(19, 'Screenshot from 2025-11-15 16-11-45.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763220664/volunteerhub/image/l1mh5c7wjbqzjip6zkab.png', 'image', 55, '2025-11-15 22:31:05'),
(20, 'Screenshot from 2025-11-14 23-55-59.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763220672/volunteerhub/image/nabjvtna3plytkjuyyqp.png', 'image', 55, '2025-11-15 22:31:13'),
(21, 'Screenshot from 2025-11-21 23-25-53.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763805451/volunteerhub/image/olbhut2amhdmrb9rzu6i.png', 'image', 59, '2025-11-22 16:57:32'),
(22, 'Screenshot from 2025-11-21 23-25-53.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763805469/volunteerhub/image/m9q5zigpppjrmatb4pun.png', 'image', 59, '2025-11-22 16:57:50'),
(23, 'Screenshot from 2025-11-21 23-25-53.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763805496/volunteerhub/image/hctfwnrmokp0whiu2gyo.png', 'image', 59, '2025-11-22 16:58:16'),
(24, 'Screencast from 2025-11-22 17-09-37.mp4', 'https://res.cloudinary.com/dpcrzajx2/video/upload/v1763806219/volunteerhub/video/mdwrwafmbxum92uhttmm.mp4', 'image', 59, '2025-11-22 17:10:20'),
(25, 'Screenshot from 2025-11-20 20-40-14.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763806302/volunteerhub/image/vkmvvb84s7tr8o7kb26u.png', 'image', 59, '2025-11-22 17:11:42'),
(26, 'Screenshot from 2025-11-20 20-40-14.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763806302/volunteerhub/image/yen3ffyleotm9aajlgvi.png', 'image', 59, '2025-11-22 17:11:42'),
(27, 'Screenshot from 2025-11-20 20-32-35.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763806302/volunteerhub/image/xbew8boumlxkupgvykbm.png', 'image', 59, '2025-11-22 17:11:42'),
(28, 'Screenshot from 2025-11-20 21-48-13.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763806302/volunteerhub/image/t370ilhzskojklnyyemu.png', 'image', 59, '2025-11-22 17:11:43'),
(29, 'Screencast from 2025-11-22 17-09-37.mp4', 'https://res.cloudinary.com/dpcrzajx2/video/upload/v1763806303/volunteerhub/video/pfkj0eixpi1j3holiuxn.mp4', 'image', 59, '2025-11-22 17:11:44'),
(30, 'Screenshot from 2025-11-27 17-42-33.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1764320700/volunteerhub/image/jfycuz4kr3orgi0irhgk.png', 'image', 59, '2025-11-28 16:05:01'),
(31, 'Screenshot from 2025-12-08 13-58-21.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765178278/volunteerhub/image/ekrqiatkutrwhqcyfiwd.png', 'image', 59, '2025-12-08 14:17:59'),
(32, 'Screenshot from 2025-12-09 01-10-32.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765272625/volunteerhub/image/brp59s2sklu88kz4ijdf.png', 'image', 59, '2025-12-09 16:30:26'),
(33, 'Screenshot from 2025-12-09 01-10-32.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765272744/volunteerhub/image/c1sst64xlrlti43c8lsh.png', 'image', 59, '2025-12-09 16:32:25'),
(34, 'Screenshot from 2025-12-09 15-25-15.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765272993/volunteerhub/image/r3vsr8b2qixsfj3woumr.png', 'image', 59, '2025-12-09 16:36:33'),
(35, 'UETCustom-fotor-20251123171013 (1).png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765291797/volunteerhub/image/nkxobxi8tozzjqzgadyr.png', 'image', 59, '2025-12-09 21:49:57'),
(36, 'Screenshot from 2025-12-09 19-23-10.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765297121/volunteerhub/image/to8glyreivnqs6tjfk5p.png', 'image', 59, '2025-12-09 23:18:42'),
(37, 'Screenshot from 2025-12-09 19-34-00.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765297725/volunteerhub/image/z5vnmbn6vxpjpnscy9ly.png', 'image', 58, '2025-12-09 23:28:45'),
(38, 'Screenshot from 2025-12-09 20-23-04.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765297725/volunteerhub/image/r4exmyukj0net8rok744.png', 'image', 58, '2025-12-09 23:28:47'),
(39, 'Screenshot from 2025-12-09 20-23-04.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765297785/volunteerhub/image/qe6zj8lcznotkltcptfw.png', 'image', 58, '2025-12-09 23:29:45'),
(40, 'Screenshot from 2025-12-09 20-23-04.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765297847/volunteerhub/image/ykhdaz3ennnxhnz9aw3x.png', 'image', 58, '2025-12-09 23:30:48'),
(41, 'Screenshot from 2025-12-09 20-13-55.png', 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1765353580/volunteerhub/image/vs7njvcolk5rh7l0nwsh.png', 'image', 59, '2025-12-10 14:59:41');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` bigint NOT NULL,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `post_id`, `user_id`, `created_at`, `deleted_at`) VALUES
(5, 1, 9, '2025-10-29 21:51:00', '2025-11-08 23:15:11'),
(10, 1, 52, '2025-10-29 22:12:03', NULL),
(15, 2, 46, '2025-10-29 22:44:21', NULL),
(16, 1, 46, '2025-10-31 21:02:37', NULL),
(17, 1, 49, '2025-10-31 23:27:33', NULL),
(23, 2, 9, '2025-11-09 00:31:41', NULL),
(24, 6, 55, '2025-11-09 17:04:30', '2025-11-10 16:42:07'),
(25, 5, 55, '2025-11-09 22:59:14', NULL),
(26, 7, 55, '2025-11-10 16:14:52', NULL),
(27, 2, 55, '2025-11-10 16:30:49', '2025-11-11 22:18:45'),
(28, 3, 56, '2025-11-10 23:33:45', NULL),
(29, 19, 56, '2025-11-11 21:28:47', NULL),
(30, 18, 56, '2025-11-11 21:28:48', NULL),
(31, 19, 55, '2025-11-11 22:07:41', NULL),
(32, 18, 55, '2025-11-11 22:08:22', NULL),
(33, 17, 55, '2025-11-11 22:13:42', NULL),
(34, 19, 58, '2025-11-14 14:19:48', NULL),
(35, 20, 55, '2025-11-15 16:57:41', NULL),
(36, 20, 59, '2025-11-15 17:00:00', NULL),
(37, 16, 55, '2025-11-15 18:07:38', NULL),
(38, 10, 55, '2025-11-15 18:08:15', NULL),
(39, 11, 55, '2025-11-15 18:08:16', NULL),
(40, 12, 55, '2025-11-15 18:08:17', NULL),
(41, 13, 55, '2025-11-15 18:08:17', NULL),
(42, 14, 55, '2025-11-15 18:08:18', NULL),
(43, 15, 55, '2025-11-15 18:08:19', NULL),
(44, 9, 55, '2025-11-15 18:08:55', NULL),
(45, 3, 55, '2025-11-17 16:09:38', NULL),
(46, 23, 59, '2025-11-23 15:07:48', '2025-11-23 15:07:53'),
(47, 20, 58, '2025-12-01 00:29:42', '2025-12-01 00:29:43'),
(48, 21, 58, '2025-12-01 00:29:51', NULL),
(49, 21, 59, '2025-12-02 13:44:38', '2025-12-02 13:44:39'),
(50, 2, 59, '2025-12-02 13:56:40', '2025-12-02 13:56:41'),
(51, 24, 58, '2025-12-10 15:21:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `organization` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `managers`
--

INSERT INTO `managers` (`id`, `user_id`, `organization`) VALUES
(2, 49, NULL),
(3, 56, NULL),
(4, 57, NULL),
(5, 59, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`, `deleted_at`) VALUES
(1, 56, 'Bài viết của bạn (ID: 11) đã được phê duyệt.', 1, '2025-11-10 22:10:51', NULL),
(2, 56, 'Bài viết của bạn (ID: 12) đã được phê duyệt.', 1, '2025-11-10 22:13:50', NULL),
(3, 56, 'Bài viết của bạn (ID: 13) đã được phê duyệt.', 1, '2025-11-10 22:22:44', NULL),
(4, 56, 'Bài viết của bạn (ID: 14) đã được phê duyệt.', 1, '2025-11-10 22:24:21', NULL),
(5, 56, 'Bài viết của bạn (ID: 16) đã được phê duyệt.', 1, '2025-11-10 23:15:30', NULL),
(6, 56, 'Bài viết của bạn (ID: 17) đã được phê duyệt.', 1, '2025-11-10 23:17:15', NULL),
(7, 56, 'Bài viết của bạn (ID: 15) đã được phê duyệt.', 1, '2025-11-10 23:17:23', NULL),
(8, 56, 'Bài viết của bạn (ID: 18) đã được phê duyệt.', 1, '2025-11-11 16:56:10', NULL),
(9, 56, 'Bài viết của bạn (ID: 19) đã được phê duyệt.', 1, '2025-11-11 21:28:34', NULL),
(10, 56, 'ntkien đã bình luận về bài viết của bạn (ID: 19)', 1, '2025-11-11 21:40:12', NULL),
(11, 55, 'undefined đã thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:41', NULL),
(12, 55, 'undefined đã bỏ thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:42', NULL),
(13, 55, 'ntkien đã thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:43', NULL),
(14, 55, 'undefined đã bỏ thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:43', NULL),
(15, 55, 'ntkien đã thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:43', NULL),
(16, 55, 'undefined đã bỏ thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:44', NULL),
(17, 55, 'ntkien đã thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:45', NULL),
(18, 55, 'undefined đã bỏ thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:46', NULL),
(19, 55, 'ntkien đã thích bài viết của bạn (ID: 19)', 1, '2025-11-11 22:07:47', NULL),
(20, 55, 'undefined đã thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:08:22', NULL),
(21, 55, '55 đã thích bài viết của bạn (ID: 17)', 1, '2025-11-11 22:13:42', NULL),
(22, 55, '55 đã bỏ thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:14:06', NULL),
(23, 56, 'ntkien đã thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:05', NULL),
(24, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:08', NULL),
(25, 56, 'ntkien đã thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:10', NULL),
(26, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:10', NULL),
(27, 56, 'ntkien đã thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:10', NULL),
(28, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:11', NULL),
(29, 56, 'ntkien đã thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:11', NULL),
(30, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:11', NULL),
(31, 56, 'ntkien đã thích bài viết của bạn (ID: 18)', 1, '2025-11-11 22:21:11', NULL),
(32, 56, 'Sự kiện của bạn (ID: 49, Tên: hoat dong tu thien) đã được phê duyệt.', 1, '2025-11-12 16:29:38', NULL),
(33, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 19)', 1, '2025-11-12 17:48:47', NULL),
(34, 56, 'ntkien đã thích bài viết của bạn (ID: 19)', 0, '2025-11-12 17:49:03', NULL),
(35, 56, 'ntkien đã bình luận về bài viết của bạn (ID: 19)', 0, '2025-11-12 17:49:11', NULL),
(36, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 19)', 0, '2025-11-12 17:49:29', NULL),
(37, 56, 'ntkien đã thích bài viết của bạn (ID: 19)', 0, '2025-11-12 17:49:30', NULL),
(38, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 19)', 0, '2025-11-12 17:49:30', NULL),
(39, 56, 'ntkien đã thích bài viết của bạn (ID: 19)', 0, '2025-11-12 17:49:31', NULL),
(40, 56, 'Nguyen Trung Kien đã thích bài viết của bạn (ID: 19)', 0, '2025-11-14 14:19:48', NULL),
(41, 49, 'Nguyen Trung Kien đã bình luận về bài viết của bạn (ID: 3)', 0, '2025-11-15 16:28:58', NULL),
(42, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-15 16:57:41', NULL),
(43, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-15 16:57:42', NULL),
(44, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-15 16:57:43', NULL),
(45, 56, 'Nguyen Trung Kien đã bình luận về bài viết của bạn (ID: 18)', 0, '2025-11-15 17:55:41', NULL),
(46, 46, 'ntkien đã bỏ thích bài viết của bạn (ID: 5)', 0, '2025-11-15 18:07:05', NULL),
(47, 46, 'ntkien đã thích bài viết của bạn (ID: 5)', 0, '2025-11-15 18:07:06', NULL),
(48, 46, 'ntkien đã bỏ thích bài viết của bạn (ID: 5)', 0, '2025-11-15 18:07:06', NULL),
(49, 46, 'ntkien đã thích bài viết của bạn (ID: 5)', 0, '2025-11-15 18:07:07', NULL),
(50, 56, 'ntkien đã thích bài viết của bạn (ID: 7)', 0, '2025-11-15 18:07:09', NULL),
(51, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 7)', 0, '2025-11-15 18:07:30', NULL),
(52, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 17)', 0, '2025-11-15 18:07:35', NULL),
(53, 56, 'ntkien đã thích bài viết của bạn (ID: 16)', 0, '2025-11-15 18:07:38', NULL),
(54, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 16)', 0, '2025-11-15 18:07:41', NULL),
(55, 56, 'ntkien đã thích bài viết của bạn (ID: 10)', 0, '2025-11-15 18:08:15', NULL),
(56, 56, 'ntkien đã thích bài viết của bạn (ID: 11)', 0, '2025-11-15 18:08:16', NULL),
(57, 56, 'ntkien đã thích bài viết của bạn (ID: 12)', 0, '2025-11-15 18:08:17', NULL),
(58, 56, 'ntkien đã thích bài viết của bạn (ID: 13)', 0, '2025-11-15 18:08:17', NULL),
(59, 56, 'ntkien đã thích bài viết của bạn (ID: 14)', 0, '2025-11-15 18:08:18', NULL),
(60, 56, 'ntkien đã thích bài viết của bạn (ID: 15)', 0, '2025-11-15 18:08:19', NULL),
(61, 56, 'ntkien đã thích bài viết của bạn (ID: 16)', 0, '2025-11-15 18:08:20', NULL),
(62, 56, 'ntkien đã thích bài viết của bạn (ID: 17)', 0, '2025-11-15 18:08:22', NULL),
(63, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 17)', 0, '2025-11-15 18:08:22', NULL),
(64, 56, 'ntkien đã thích bài viết của bạn (ID: 17)', 0, '2025-11-15 18:08:23', NULL),
(65, 56, 'ntkien đã bỏ thích bài viết của bạn (ID: 16)', 0, '2025-11-15 18:08:25', NULL),
(66, 56, 'ntkien đã thích bài viết của bạn (ID: 16)', 0, '2025-11-15 18:08:51', NULL),
(67, 56, 'ntkien đã thích bài viết của bạn (ID: 7)', 0, '2025-11-15 18:08:53', NULL),
(68, 56, 'ntkien đã thích bài viết của bạn (ID: 9)', 0, '2025-11-15 18:08:55', NULL),
(69, 56, 'ntkien đã bình luận về bài viết của bạn (ID: 9)', 0, '2025-11-15 18:09:00', NULL),
(70, 56, 'ntkien đã bình luận về bài viết của bạn (ID: 9)', 0, '2025-11-15 18:09:46', NULL),
(71, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:05:41', NULL),
(72, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:05:51', NULL),
(73, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:05:52', NULL),
(74, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:05:52', NULL),
(75, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:05:53', NULL),
(76, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:05:58', NULL),
(77, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:05:59', NULL),
(78, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:00', NULL),
(79, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:00', NULL),
(80, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:00', NULL),
(81, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:00', NULL),
(82, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:01', NULL),
(83, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:01', NULL),
(84, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:01', NULL),
(85, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:02', NULL),
(86, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:02', NULL),
(87, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:03', NULL),
(88, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:04', NULL),
(89, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:05', NULL),
(90, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:07', NULL),
(91, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:06:12', NULL),
(92, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:07:16', NULL),
(93, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:08:25', NULL),
(94, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:09:38', NULL),
(95, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:11:46', NULL),
(96, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:11:54', NULL),
(97, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:11:55', NULL),
(98, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:11:55', NULL),
(99, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:11:56', NULL),
(100, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:11:56', NULL),
(101, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:11:58', NULL),
(102, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:12:13', NULL),
(103, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:47', NULL),
(104, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:53', NULL),
(105, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:54', NULL),
(106, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:55', NULL),
(107, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:55', NULL),
(108, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:55', NULL),
(109, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:56', NULL),
(110, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:56', NULL),
(111, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:56', NULL),
(112, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:56', NULL),
(113, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:57', NULL),
(114, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:57', NULL),
(115, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:57', NULL),
(116, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:58', NULL),
(117, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:14:58', NULL),
(118, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:15:02', NULL),
(119, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:15:22', NULL),
(120, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:16:08', NULL),
(121, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:17:07', NULL),
(122, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:17:58', NULL),
(123, 59, 'ntkien đã bình luận về bài viết của bạn (ID: 20)', 1, '2025-11-17 16:18:02', NULL),
(124, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:18:47', NULL),
(125, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:18:49', NULL),
(126, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:19:31', NULL),
(127, 49, 'ntkien đã bình luận về bài viết của bạn (ID: 3)', 0, '2025-11-17 16:19:40', NULL),
(128, 59, 'ntkien đã bình luận về bài viết của bạn (ID: 20)', 1, '2025-11-17 16:20:28', NULL),
(129, 59, 'ntkien đã bình luận về bài viết của bạn (ID: 20)', 1, '2025-11-17 16:20:30', NULL),
(130, 49, 'ntkien đã bình luận về bài viết của bạn (ID: 3)', 0, '2025-11-17 16:21:39', NULL),
(131, 49, 'ntkien đã bình luận về bài viết của bạn (ID: 3)', 0, '2025-11-17 16:21:41', NULL),
(132, 59, 'ntkien đã bình luận về bài viết của bạn (ID: 20)', 1, '2025-11-17 16:24:14', NULL),
(133, 59, 'ntkien đã bình luận về bài viết của bạn (ID: 20)', 1, '2025-11-17 16:24:16', NULL),
(134, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:26:04', NULL),
(135, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:28:21', NULL),
(136, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:28:26', NULL),
(137, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:28:36', NULL),
(138, 59, 'ntkien đã bình luận về bài viết của bạn (ID: 20)', 1, '2025-11-17 16:28:43', NULL),
(139, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:28:49', NULL),
(140, 49, 'ntkien đã bình luận về bài viết của bạn (ID: 3)', 0, '2025-11-17 16:28:52', NULL),
(141, 49, 'ntkien đã bình luận về bài viết của bạn (ID: 3)', 0, '2025-11-17 16:28:54', NULL),
(142, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:29:11', NULL),
(143, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:33:44', NULL),
(144, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:25', NULL),
(145, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:27', NULL),
(146, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:27', NULL),
(147, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:28', NULL),
(148, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:28', NULL),
(149, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:29', NULL),
(150, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:29', NULL),
(151, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:29', NULL),
(152, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:40', NULL),
(153, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:41', NULL),
(154, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:35:41', NULL),
(155, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:10', NULL),
(156, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:10', NULL),
(157, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:10', NULL),
(158, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:11', NULL),
(159, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:11', NULL),
(160, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:11', NULL),
(161, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:11', NULL),
(162, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:11', NULL),
(163, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:12', NULL),
(164, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:36:53', NULL),
(165, 49, 'ntkien đã bỏ thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:37:01', NULL),
(166, 49, 'ntkien đã thích bài viết của bạn (ID: 3)', 0, '2025-11-17 16:39:01', NULL),
(167, 59, 'ntkien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:39:08', NULL),
(168, 59, 'ntkien đã thích bài viết của bạn (ID: 20)', 1, '2025-11-17 16:40:05', NULL),
(169, 59, 'Sự kiện của bạn (ID: 53, Tên: 123123) đã được phê duyệt.', 1, '2025-11-30 21:34:39', NULL),
(170, 49, 'Sự kiện của bạn (ID: 28, Tên: Test) đã bị từ chối.', 0, '2025-11-30 22:16:34', NULL),
(171, 59, 'Nguyen Trung Kien đã thích bài viết của bạn (ID: 20)', 1, '2025-12-01 00:29:42', NULL),
(172, 59, 'Nguyen Trung Kien đã bỏ thích bài viết của bạn (ID: 20)', 1, '2025-12-01 00:29:43', NULL),
(173, 59, 'Nguyen Trung Kien đã thích bài viết của bạn (ID: 21)', 1, '2025-12-01 00:29:51', NULL),
(174, 59, 'Nguyen Trung Kien đã bỏ thích bài viết của bạn (ID: 21)', 1, '2025-12-01 00:29:52', NULL),
(175, 59, 'Nguyen Trung Kien đã thích bài viết của bạn (ID: 21)', 1, '2025-12-01 00:29:52', NULL),
(176, 59, 'Nguyen Trung Kien đã bỏ thích bài viết của bạn (ID: 21)', 1, '2025-12-01 00:29:53', NULL),
(177, 58, 'Đơn ứng tuyển của bạn (ID: 7) đã được chấp nhận.', 1, '2025-12-02 13:52:25', NULL),
(178, 51, 'Nguyen Trung Kien đã thích bài viết của bạn (ID: 2)', 0, '2025-12-02 13:56:40', NULL),
(179, 51, 'Nguyen Trung Kien đã bỏ thích bài viết của bạn (ID: 2)', 0, '2025-12-02 13:56:41', NULL),
(180, 59, 'Sự kiện của bạn (ID: 54, Tên: 12213312) đã được phê duyệt.', 1, '2025-12-09 16:37:47', NULL),
(181, 58, 'Đơn ứng tuyển của bạn (ID: 17) đã được chấp nhận.', 1, '2025-12-09 17:14:59', NULL),
(182, 59, 'Nguyen Trung Kien đã thích bài viết của bạn (ID: 21)', 1, '2025-12-09 18:32:59', NULL),
(183, 59, 'Nguyen Trung Kien đã bình luận về bài viết của bạn (ID: 21)', 1, '2025-12-09 18:33:07', NULL),
(184, 59, 'Sự kiện của bạn (ID: 55, Tên: sinh vien tinh nguyen) đã được phê duyệt.', 1, '2025-12-09 21:50:55', NULL),
(185, 58, 'Đơn ứng tuyển của bạn (ID: 18) đã được chấp nhận.', 1, '2025-12-09 21:51:42', NULL),
(186, 58, 'Bài viết của bạn (ID: 24) đã được phê duyệt.', 1, '2025-12-09 23:31:32', NULL),
(187, 59, 'Sự kiện của bạn (ID: 56, Tên: 123123) đã được phê duyệt.', 1, '2025-12-10 00:38:31', NULL),
(188, 59, 'Sự kiện mới đã được tạo: qwe. Vui lòng phê duyệt.', 1, '2025-12-10 15:00:12', NULL),
(189, 49, 'Sự kiện của bạn (ID: 3, Tên: Hiến máu nhân đạo mùa xuân) đã được phê duyệt.', 0, '2025-12-10 15:08:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint NOT NULL,
  `event_id` bigint DEFAULT NULL,
  `author_id` bigint NOT NULL,
  `post_type` enum('discuss','recruitment') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text NOT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `media` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `event_id`, `author_id`, `post_type`, `content`, `status`, `created_at`, `updated_at`, `deleted_at`, `media`) VALUES
(1, 4, 52, 'discuss', 'hello', 'approved', '2025-10-15 10:57:12', '2025-11-08 17:37:54', NULL, NULL),
(2, 3, 51, 'discuss', 'aasdasdadasdasdaa', 'approved', '2025-10-16 22:36:00', '2025-10-19 07:58:03', NULL, NULL),
(3, 2, 49, 'recruitment', 'tuyen tinh nguyen vien', 'approved', '2025-10-30 16:22:08', '2025-10-30 16:22:08', NULL, NULL),
(4, NULL, 46, 'discuss', 'okokookkljlkjlkjlkklj', 'rejected', '2025-11-09 00:57:56', '2025-11-09 22:50:20', NULL, NULL),
(5, NULL, 46, 'discuss', 'aaaádasdasdasdasdasd', 'approved', '2025-11-09 14:36:25', '2025-11-09 07:36:42', NULL, NULL),
(6, NULL, 55, 'discuss', 'helloooooooo', 'approved', '2025-11-09 16:05:42', '2025-11-17 16:59:43', NULL, NULL),
(7, NULL, 56, 'discuss', 'asdfasfdasdf', 'approved', '2025-11-09 17:58:36', '2025-11-09 22:49:57', NULL, NULL),
(8, NULL, 56, 'discuss', 'minh la thanh vien moi', 'rejected', '2025-11-09 22:52:02', '2025-11-09 22:52:42', NULL, NULL),
(9, NULL, 56, 'discuss', '123123123123123', 'approved', '2025-11-10 22:00:58', '2025-11-10 22:01:10', NULL, NULL),
(10, NULL, 56, 'discuss', '234432342324', 'approved', '2025-11-10 22:07:57', '2025-11-10 22:08:10', NULL, NULL),
(11, NULL, 56, 'discuss', '123123123123', 'approved', '2025-11-10 22:10:44', '2025-11-10 22:10:51', NULL, NULL),
(12, NULL, 56, 'discuss', '123123123123', 'approved', '2025-11-10 22:13:28', '2025-11-10 22:13:50', NULL, NULL),
(13, NULL, 56, 'discuss', '4234234234234', 'approved', '2025-11-10 22:22:21', '2025-11-10 22:22:44', NULL, NULL),
(14, NULL, 56, 'discuss', '123123123123', 'approved', '2025-11-10 22:24:07', '2025-11-10 22:24:21', NULL, NULL),
(15, NULL, 56, 'discuss', '123123123123123', 'approved', '2025-11-10 23:14:00', '2025-11-24 01:02:10', '2025-11-24 01:02:10', NULL),
(16, NULL, 56, 'discuss', '23432513124', 'approved', '2025-11-10 23:15:15', '2025-11-24 01:01:34', '2025-11-24 01:01:34', NULL),
(17, NULL, 56, 'discuss', 'asdfadsfadsfasdfadsf', 'approved', '2025-11-10 23:17:04', '2025-11-10 23:17:15', NULL, NULL),
(18, 5, 56, 'discuss', 'asdasddfssdfsdfsfd', 'approved', '2025-11-11 16:55:50', '2025-11-11 16:56:10', NULL, NULL),
(19, 5, 56, 'discuss', '123435345345345', 'approved', '2025-11-11 21:28:13', '2025-11-11 21:28:34', NULL, NULL),
(20, 50, 59, 'recruitment', 'tuyển tính nguyện viên', 'approved', '2025-11-15 16:33:33', '2025-11-15 09:33:48', NULL, NULL),
(21, 1, 59, 'discuss', 'Xin chao', 'approved', '2025-11-22 16:58:17', '2025-11-22 10:01:31', NULL, '[\"https://res.cloudinary.com/dpcrzajx2/image/upload/v1763805496/volunteerhub/image/hctfwnrmokp0whiu2gyo.png\"]'),
(22, 2, 59, 'discuss', '14234242', 'approved', '2025-11-22 17:10:20', '2025-11-27 23:57:03', '2025-11-27 23:57:03', '[\"https://res.cloudinary.com/dpcrzajx2/video/upload/v1763806219/volunteerhub/video/mdwrwafmbxum92uhttmm.mp4\"]'),
(23, 1, 59, 'discuss', '1231231', 'approved', '2025-11-22 17:11:44', '2025-11-27 23:56:53', '2025-11-27 23:56:53', '[\"https://res.cloudinary.com/dpcrzajx2/video/upload/v1763806303/volunteerhub/video/pfkj0eixpi1j3holiuxn.mp4\", \"https://res.cloudinary.com/dpcrzajx2/image/upload/v1763806302/volunteerhub/image/t370ilhzskojklnyyemu.png\", \"https://res.cloudinary.com/dpcrzajx2/image/upload/v1763806302/volunteerhub/image/vkmvvb84s7tr8o7kb26u.png\"]'),
(24, NULL, 58, 'discuss', 'qưerwerwer', 'approved', '2025-12-09 23:30:48', '2025-12-09 23:31:32', NULL, '[\"https://res.cloudinary.com/dpcrzajx2/image/upload/v1765297847/volunteerhub/image/ykhdaz3ennnxhnz9aw3x.png\"]');

-- --------------------------------------------------------

--
-- Table structure for table `push_subscriptions`
--

CREATE TABLE `push_subscriptions` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `endpoint` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `p256dh` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `push_subscriptions`
--

INSERT INTO `push_subscriptions` (`id`, `user_id`, `endpoint`, `p256dh`, `auth`, `created_at`) VALUES
(2, 59, 'https://fcm.googleapis.com/fcm/send/elQAjzV713c:APA91bE0TpPCFUPdQ2UgZaBwDiMXZbgjqznPIDz71LZlvaa_5e_SuSjacpkE3QGivIvkPipVqlA7TGNLnyH3Ce-OxVlnB9mOgfJQpZHs5fmR7RRYb0O9SC5a9IxaKsaOOcctcnA2Vgqg', 'BMsg0Ci3jMcJ-H_8DxR_ep3SlR5I8Ep4Ko68W3UYJ8zuHw0W5_1OjDXxjhkB0w6bM69VCBMe4L8O0IkI0JbInrE', 'MqQV5C0W8e6QjOVozfTLcg', '2025-12-10 07:35:24');

-- --------------------------------------------------------

--
-- Table structure for table `root_admin`
--

CREATE TABLE `root_admin` (
  `id` bigint NOT NULL,
  `account` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `root_admin`
--

INSERT INTO `root_admin` (`id`, `account`, `password`) VALUES
(1, 'admin', 'admin'),
(2, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `introduce` text,
  `role` enum('volunteer','manager','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('active','blocked') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `avatar_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `introduce`, `role`, `status`, `created_at`, `updated_at`, `deleted_at`, `avatar_url`) VALUES
(9, 'NTKienn', '1234567891', 'test1user@example.com', '$2b$10$P/vLLCZ7sfJ7dQfYIAHPJOBIniyJx/A0iGBLkjTQ1MVr/p4lcbaYa', 'Hello, I am a test user. Hello', 'volunteer', 'blocked', '2025-10-05 15:48:20', '2025-11-09 17:50:23', NULL, NULL),
(10, 'Test User', '1234567890', 'test2user@example.com', '$2b$10$2ktyzicki206V4WxUC4Bdu2/OgNtlmZaXV0PekFpkAdhSEjwb6wF2', 'Hello, I am a test user.', 'volunteer', 'active', '2025-10-05 15:50:12', '2025-11-09 17:47:06', NULL, NULL),
(21, 'Test User', '1234567890', 'test3user@example.com', '$2b$10$aRQf3KSvdfB5FaT3oqSk4OBMMbD134c2V/Gmh8z2A1WHdoe/wN20S', 'Hello, I am a test user.', 'manager', 'active', '2025-10-05 17:02:04', '2025-10-05 17:02:04', NULL, NULL),
(41, 'Test User', '1234567890', 'test5user@example.com', '$2b$10$9Aa2ShtOj7huZTUIMFZ2huAkXdJAGUGL854mVUXunc.NHbkb5u5i6', 'Hello, I am a test user.', 'volunteer', 'active', '2025-10-05 17:27:16', '2025-10-05 17:27:16', NULL, NULL),
(42, 'Test User', '1234567890', 'test6user@example.com', '$2b$10$3wvsmXvT7rIhQ9YgrGSVWOjlXVGdzdabishb2vCyhgtok/.d5rpim', 'Hello, I am a test user.', 'manager', 'blocked', '2025-10-05 17:27:26', '2025-10-12 21:37:08', NULL, NULL),
(43, 'Test User', '1234567890', 'test6user@example.com', '$2b$10$s/sxqprvUDwJ6hjRNYZ2gujFhurdmAGm1MRIxpozHxW5/mffWL8ea', 'Hello, I am a test user.', 'volunteer', 'active', '2025-10-05 17:30:49', '2025-10-05 17:30:49', NULL, NULL),
(44, 'Test User', '1234567890', 'test1user@example.com', '$2b$10$D4PCqFMlikrQxvuXDCFNGOruh7jy0U35dFFoHIKZrqjk.7MJuC7SS', 'Hello, I am a test user.', 'manager', 'active', '2025-10-05 17:34:13', '2025-10-05 17:34:13', NULL, NULL),
(46, 'Nguyen Trung Kienn', '1234567890', 'test7user@example.com', '$2b$10$P9Ws1sx0XqMSjL8lwgi/yOkzq.r7WXSY4O7WFcs2Gdd911hFOM/Q.', 'Hello, I am a test Kien.', 'admin', 'active', '2025-10-08 14:12:52', '2025-11-08 00:07:41', NULL, 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762535261/volunteerhub/image/kkxded7aisdckij4gvdh.png'),
(47, 'Nguyen Trung Kien', '0969334765', 'kienlx2005@gmail.com', '$2b$10$NteTwSnQpyMOk.LWTR29V.ZlmiKILWW66F7tYp9BWhnsPuSNZQiTe', 'hello my name is kien', 'volunteer', 'active', '2025-10-08 17:33:27', '2025-10-08 17:33:27', NULL, NULL),
(48, 'Nguyen Trung Kien', '0969334765', '23021590@vnu.edu.vn', '$2b$10$TF92l2.4IjarON1z5f9Oo.z74gD9uPf.Z2VWcaQTBDDS64s0kRiHa', 'Toi ten la kien', 'volunteer', 'active', '2025-10-11 10:05:05', '2025-10-11 10:05:05', NULL, NULL),
(49, 'Test User1', '1234567890', 'test7user@example.com', '$2b$10$G2BrvUBYszyNCTLf8XmgneQhHc14VA3h2JnDCAfR6seBP3tDdHSJK', 'Hello, I am a test user.', 'manager', 'active', '2025-10-11 10:50:47', '2025-11-07 07:09:47', NULL, NULL),
(51, 'Test User1', '1234567890', '23021590@vnu.edu.vn', '$2b$10$aiNmISy0ddCGfkprw9rJ8O/k6tpv22PJK7dPGr3Xt.AYp.LMVN7ZO', 'Hello, I am a test user.', 'volunteer', 'active', '2025-10-12 23:40:38', '2025-10-19 07:57:52', NULL, NULL),
(52, 'Test User1', '1234567890', 'test10user@example.com', '$2b$10$DTg0b7c1H90elXnbVy1bmui2BxPc8mDwv1cETHBDfipeVrstIynzq', 'Hello, I am a test user.', 'admin', 'active', '2025-10-12 23:45:50', '2025-11-08 00:42:13', NULL, 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1762537332/volunteerhub/image/mfjj6oo6mw6ff5v9pb3n.png'),
(53, 'Nguyen Trung Kien', '0969334765', 'ntk@gmail.com', '$2b$10$yGyugY6UwOzSHqXNCMgxxe6Ca0f39v7A9YawnrzIGlz8JFFRWiKia', '', 'volunteer', 'active', '2025-11-01 21:04:14', '2025-11-01 21:04:14', NULL, NULL),
(54, 'Tungdb', '0982876354', 't@gmail.com', '$2b$10$AAO7Vh3CoNtWybvqnclT8OJXKtPk.YcHKN3/ou0UNNqy11.NgfPlq', '', 'volunteer', 'active', '2025-11-04 13:52:15', '2025-11-04 13:52:15', NULL, NULL),
(55, 'ntkien', '0969334765', 'kk@gmail.com', '$2b$10$L1ZstAPMbcpk1B6yQIaKseVqwDScCXkUEz//twHdz3PN9UTaQ.Yse', '', 'admin', 'active', '2025-11-09 14:46:41', '2025-11-15 22:31:13', NULL, 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763220672/volunteerhub/image/nabjvtna3plytkjuyyqp.png'),
(56, 'Kien', '0998877654', 'kkk@gmail.com', '$2b$10$1FBJfhJC58WvyRtSimeQDedi2Wt1mmxSwu85/TIQ0z08QZsPwOe0.', '', 'manager', 'active', '2025-11-09 15:10:27', '2025-11-09 15:10:27', NULL, NULL),
(57, 'Nguyen Trung Kien', '0987654321', 'kkkk@gmail.com', '$2b$10$.00ULu2e6whPb9pHRRzaCOUxDd7RWqfn1UH.0.WQZ65wpvYste/4y', '', 'manager', 'active', '2025-11-09 15:17:46', '2025-11-09 15:17:46', NULL, NULL),
(58, 'Nguyen Trung Kien', '0969334765', 'kk@gmail.com', '$2b$10$pFntufwoAOIyeSd6xi/9XuyFa84mlxQPUHidBcF3hQlzV6Z8iNB7m', '', 'volunteer', 'active', '2025-11-12 17:55:43', '2025-12-10 16:24:27', NULL, 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1763203578/volunteerhub/image/vzh0u9uffpfyvswyasxg.png'),
(59, 'Nguyen Trung Kien', '0969334765', 'kk@gmail.com', '$2b$10$WplO3LlReOfb8JYhx.8OAOAw3tBtzSc3Bp4Ii5qdT3YYXqQtA9S1W', '', 'manager', 'active', '2025-11-14 14:22:33', '2025-11-28 16:05:37', NULL, 'https://res.cloudinary.com/dpcrzajx2/image/upload/v1764320700/volunteerhub/image/jfycuz4kr3orgi0irhgk.png');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `after_user_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.role = 'volunteer' THEN
        INSERT INTO volunteers (user_id) VALUES (NEW.id);
    ELSEIF NEW.role = 'manager' THEN
        INSERT INTO managers (user_id) VALUES (NEW.id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `volunteers`
--

CREATE TABLE `volunteers` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `credibility` int DEFAULT '0',
  `contributed` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `volunteers`
--

INSERT INTO `volunteers` (`id`, `user_id`, `credibility`, `contributed`) VALUES
(1, 46, 0, 0),
(2, 47, 0, 0),
(3, 48, 0, 0),
(4, 51, 0, 0),
(5, 53, 0, 0),
(6, 54, 0, 0),
(7, 55, 0, 0),
(8, 58, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `event_id` (`event_id`,`volunteer_id`),
  ADD KEY `fk_app_vol` (`volunteer_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comment_post` (`post_id`),
  ADD KEY `fk_comment_user` (`author_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_manager` (`manager_id`),
  ADD KEY `fk_event_category` (`category_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_id` (`post_id`,`user_id`),
  ADD KEY `fk_like_user` (`user_id`);

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_post_event` (`event_id`),
  ADD KEY `fk_post_user` (`author_id`);

--
-- Indexes for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `root_admin`
--
ALTER TABLE `root_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `managers`
--
ALTER TABLE `managers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `root_admin`
--
ALTER TABLE `root_admin`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `volunteers`
--
ALTER TABLE `volunteers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `fk_app_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_app_vol` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comment_user` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_event_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `fk_event_manager` FOREIGN KEY (`manager_id`) REFERENCES `managers` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_like_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `managers`
--
ALTER TABLE `managers`
  ADD CONSTRAINT `fk_manager_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_post_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_post_user` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  ADD CONSTRAINT `push_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD CONSTRAINT `fk_volunteer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
