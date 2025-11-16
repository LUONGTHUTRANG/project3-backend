-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               9.4.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.12.0.7122
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ktx_db
DROP DATABASE IF EXISTS `ktx_db`;
CREATE DATABASE IF NOT EXISTS `ktx_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ktx_db`;

-- Dumping structure for table ktx_db.activity_log
DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE IF NOT EXISTS `activity_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `sys_users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.activity_log: ~0 rows (approximately)
DELETE FROM `activity_log`;

-- Dumping structure for table ktx_db.bill
DROP TABLE IF EXISTS `bill`;
CREATE TABLE IF NOT EXISTS `bill` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `payer_id` int NOT NULL,
  `bill_status` enum('unpaid','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'unpaid',
  `bill_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `creator_id` int DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT '0.00',
  `descriptions` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`bill_id`),
  KEY `payer_id` (`payer_id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`payer_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `bill_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `managers` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.bill: ~2 rows (approximately)
DELETE FROM `bill`;
INSERT INTO `bill` (`bill_id`, `payer_id`, `bill_status`, `bill_time`, `creator_id`, `total_amount`, `descriptions`) VALUES
	(1, 1, 'paid', '2025-11-16 00:09:19', 1, 1000000.00, 'Tiền điện, nước, dịch vụ tháng 9'),
	(2, 3, 'unpaid', '2025-11-16 00:09:19', 1, 2000000.00, 'Tiền phòng kỳ 2 - 2025');

-- Dumping structure for table ktx_db.buildings
DROP TABLE IF EXISTS `buildings`;
CREATE TABLE IF NOT EXISTS `buildings` (
  `building_id` int NOT NULL AUTO_INCREMENT,
  `building_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_gender` enum('male','female','mixed') COLLATE utf8mb4_unicode_ci DEFAULT 'mixed',
  `address` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descriptions` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`building_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.buildings: ~3 rows (approximately)
DELETE FROM `buildings`;
INSERT INTO `buildings` (`building_id`, `building_name`, `building_gender`, `address`, `descriptions`) VALUES
	(1, 'A1', 'male', NULL, 'Ký túc xá nam - khu A'),
	(2, 'A2', 'female', NULL, 'Ký túc xá nữ - khu A'),
	(3, 'B1', 'mixed', NULL, 'Ký túc xá chung - khu B');

-- Dumping structure for table ktx_db.form_register
DROP TABLE IF EXISTS `form_register`;
CREATE TABLE IF NOT EXISTS `form_register` (
  `form_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `time_register` datetime DEFAULT CURRENT_TIMESTAMP,
  `preferred_building_id` int DEFAULT NULL,
  `preferred_room_type_id` int DEFAULT NULL,
  `preferred_roommate_id` int DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `form_status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `is_special` bit(1) DEFAULT b'0',
  `special_verification` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `time_execute` datetime DEFAULT NULL,
  `period_id` int DEFAULT NULL,
  PRIMARY KEY (`form_id`),
  KEY `student_id` (`student_id`),
  KEY `preferred_building_id` (`preferred_building_id`),
  KEY `preferred_room_type_id` (`preferred_room_type_id`),
  KEY `preferred_roommate_id` (`preferred_roommate_id`),
  CONSTRAINT `form_register_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `form_register_ibfk_2` FOREIGN KEY (`preferred_building_id`) REFERENCES `buildings` (`building_id`),
  CONSTRAINT `form_register_ibfk_3` FOREIGN KEY (`preferred_room_type_id`) REFERENCES `room_types` (`room_type_id`),
  CONSTRAINT `form_register_ibfk_4` FOREIGN KEY (`preferred_roommate_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.form_register: ~4 rows (approximately)
DELETE FROM `form_register`;
INSERT INTO `form_register` (`form_id`, `student_id`, `time_register`, `preferred_building_id`, `preferred_room_type_id`, `preferred_roommate_id`, `preferences`, `form_status`, `is_special`, `special_verification`, `manager_id`, `time_execute`, `period_id`) VALUES
	(1, 1, '2025-11-16 00:09:19', 1, 3, NULL, '{"sleep": "early", "province": "Thanh Hoa"}', 'pending', b'0', NULL, NULL, NULL, NULL),
	(2, 2, '2025-11-16 00:09:19', 2, 2, NULL, '{"sleep": "late", "province": "Bac Ninh"}', 'pending', b'0', NULL, NULL, NULL, NULL),
	(3, 3, '2025-11-16 00:09:19', 1, 3, NULL, '{"music": "rock", "province": "Nghe An"}', 'approved', b'0', NULL, NULL, NULL, NULL),
	(4, 4, '2025-11-16 00:09:19', 2, 2, NULL, '{"health": "special", "province": "Ha Noi"}', 'pending', b'1', NULL, NULL, NULL, NULL);

-- Dumping structure for table ktx_db.managers
DROP TABLE IF EXISTS `managers`;
CREATE TABLE IF NOT EXISTS `managers` (
  `manager_id` int NOT NULL AUTO_INCREMENT,
  `manager_name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manager_address` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_CCCD` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_email` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`manager_id`),
  UNIQUE KEY `manager_CCCD` (`manager_CCCD`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.managers: ~2 rows (approximately)
DELETE FROM `managers`;
INSERT INTO `managers` (`manager_id`, `manager_name`, `manager_address`, `manager_phone`, `manager_CCCD`, `manager_email`) VALUES
	(1, 'Nguyễn Văn An', '123 Nguyễn Trãi, Hà Nội', '0905123456', '012345678900', 'an.nguyen@ktx.edu.vn'),
	(2, 'Trần Thị Bình', '45 Hai Bà Trưng, Hà Nội', '0987456123', '098765432111', 'binh.tran@ktx.edu.vn');

-- Dumping structure for table ktx_db.manager_building
DROP TABLE IF EXISTS `manager_building`;
CREATE TABLE IF NOT EXISTS `manager_building` (
  `manager_id` int NOT NULL,
  `building_id` int NOT NULL,
  `period_id` int NOT NULL,
  PRIMARY KEY (`manager_id`,`building_id`,`period_id`),
  KEY `building_id` (`building_id`),
  KEY `period_id` (`period_id`),
  CONSTRAINT `manager_building_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `managers` (`manager_id`),
  CONSTRAINT `manager_building_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`),
  CONSTRAINT `manager_building_ibfk_3` FOREIGN KEY (`period_id`) REFERENCES `period_stay` (`period_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.manager_building: ~2 rows (approximately)
DELETE FROM `manager_building`;
INSERT INTO `manager_building` (`manager_id`, `building_id`, `period_id`) VALUES
	(1, 1, 1),
	(2, 2, 1);

-- Dumping structure for table ktx_db.notification
DROP TABLE IF EXISTS `notification`;
CREATE TABLE IF NOT EXISTS `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `notification_content` text COLLATE utf8mb4_unicode_ci,
  `sender_id` int DEFAULT NULL,
  `notification_status` enum('active','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`notification_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `managers` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.notification: ~2 rows (approximately)
DELETE FROM `notification`;
INSERT INTO `notification` (`notification_id`, `notification_time`, `notification_content`, `sender_id`, `notification_status`) VALUES
	(1, '2025-11-16 00:09:19', 'Ký túc xá sẽ tiến hành bảo trì hệ thống nước trong 2 ngày 5-6/9.', 1, 'active'),
	(2, '2025-11-16 00:09:19', 'Sinh viên cần hoàn tất đăng ký ở trước ngày 15/8.', 2, 'active');

-- Dumping structure for table ktx_db.notification_receiver
DROP TABLE IF EXISTS `notification_receiver`;
CREATE TABLE IF NOT EXISTS `notification_receiver` (
  `notification_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `notification_receive_status` enum('unread','read') COLLATE utf8mb4_unicode_ci DEFAULT 'unread',
  PRIMARY KEY (`notification_id`,`receiver_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `notification_receiver_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`notification_id`),
  CONSTRAINT `notification_receiver_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.notification_receiver: ~4 rows (approximately)
DELETE FROM `notification_receiver`;
INSERT INTO `notification_receiver` (`notification_id`, `receiver_id`, `notification_receive_status`) VALUES
	(1, 1, 'unread'),
	(1, 2, 'read'),
	(2, 3, 'unread'),
	(2, 4, 'unread');

-- Dumping structure for table ktx_db.period_stay
DROP TABLE IF EXISTS `period_stay`;
CREATE TABLE IF NOT EXISTS `period_stay` (
  `period_id` int NOT NULL AUTO_INCREMENT,
  `time_start` datetime NOT NULL,
  `time_end` datetime NOT NULL,
  `period_number` int NOT NULL,
  `period_year` int NOT NULL,
  PRIMARY KEY (`period_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.period_stay: ~3 rows (approximately)
DELETE FROM `period_stay`;
INSERT INTO `period_stay` (`period_id`, `time_start`, `time_end`, `period_number`, `period_year`) VALUES
	(1, '2025-09-01 00:00:00', '2026-01-15 00:00:00', 1, 2025),
	(2, '2026-01-15 00:00:00', '2026-06-30 00:00:00', 2, 2025),
	(3, '2026-07-01 00:00:00', '2026-08-31 00:00:00', 3, 2025);

-- Dumping structure for table ktx_db.rooms
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `building_id` int NOT NULL,
  `room_type_id` int NOT NULL,
  `room_status` enum('available','maintenance','full') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `note` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `building_id` (`building_id`),
  KEY `room_type_id` (`room_type_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`room_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.rooms: ~4 rows (approximately)
DELETE FROM `rooms`;
INSERT INTO `rooms` (`room_id`, `room_name`, `building_id`, `room_type_id`, `room_status`, `note`) VALUES
	(1, 'A1-101', 1, 3, 'available', 'Phòng tầng 1'),
	(2, 'A1-102', 1, 3, 'available', 'Phòng tầng 1'),
	(3, 'A2-201', 2, 2, 'available', 'Phòng tầng 2'),
	(4, 'B1-301', 3, 1, 'available', 'Phòng tầng 3');

-- Dumping structure for table ktx_db.room_stay
DROP TABLE IF EXISTS `room_stay`;
CREATE TABLE IF NOT EXISTS `room_stay` (
  `stay_id` int NOT NULL AUTO_INCREMENT,
  `period_id` int NOT NULL,
  `room_id` int NOT NULL,
  `student_id` int NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `stay_status` enum('active','finished','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `allocation_type` enum('auto','manual') COLLATE utf8mb4_unicode_ci DEFAULT 'auto',
  PRIMARY KEY (`stay_id`),
  KEY `period_id` (`period_id`),
  KEY `room_id` (`room_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `room_stay_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `period_stay` (`period_id`),
  CONSTRAINT `room_stay_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`),
  CONSTRAINT `room_stay_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.room_stay: ~2 rows (approximately)
DELETE FROM `room_stay`;
INSERT INTO `room_stay` (`stay_id`, `period_id`, `room_id`, `student_id`, `start_date`, `end_date`, `stay_status`, `allocation_type`) VALUES
	(1, 1, 1, 1, '2025-08-10 00:00:00', '2026-05-30 00:00:00', 'active', 'auto'),
	(2, 1, 1, 3, '2025-08-10 00:00:00', '2026-05-30 00:00:00', 'active', 'auto');

-- Dumping structure for table ktx_db.room_types
DROP TABLE IF EXISTS `room_types`;
CREATE TABLE IF NOT EXISTS `room_types` (
  `room_type_id` int NOT NULL AUTO_INCREMENT,
  `building_id` int NOT NULL,
  `capacity` int NOT NULL,
  `room_price` decimal(12,2) NOT NULL,
  `descriptions` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`room_type_id`),
  KEY `building_id` (`building_id`),
  CONSTRAINT `room_types_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.room_types: ~3 rows (approximately)
DELETE FROM `room_types`;
INSERT INTO `room_types` (`room_type_id`, `building_id`, `capacity`, `room_price`, `descriptions`) VALUES
	(1, 1, 8, 2400000.00, 'Phòng 8 người, có điều hòa, nóng lạnh.'),
	(2, 2, 10, 2000000.00, 'Phòng 10 người, có điều hòa, nóng lạnh'),
	(3, 3, 10, 1000000.00, 'Phòng 10 người, không có điều hòa và nóng lạnh');

-- Dumping structure for table ktx_db.students
DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date DEFAULT NULL,
  `student_address` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_email` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_MSSV` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year_of_study` int DEFAULT NULL,
  `major` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `student_MSSV` (`student_MSSV`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.students: ~4 rows (approximately)
DELETE FROM `students`;
INSERT INTO `students` (`student_id`, `student_name`, `gender`, `dob`, `student_address`, `student_phone`, `student_email`, `student_MSSV`, `province`, `year_of_study`, `major`) VALUES
	(1, 'Lê Minh Hoàng', 'male', '2004-03-15', 'Thanh Hóa', '0901111222', 'hoang.le@sv.edu.vn', '20225111', 'Thanh Hóa', 3, 'Khoa học máy tính'),
	(2, 'Nguyễn Thu Trang', 'female', '2004-09-05', 'Bắc Ninh', '0902222333', 'trang.nguyen@sv.edu.vn', '20234567', 'Bắc Ninh', 3, 'Công nghệ thông tin'),
	(3, 'Phạm Anh Tuấn', 'male', '2003-12-01', 'Nghệ An', '0903333444', 'tuan.pham@sv.edu.vn', '20217778', 'Nghệ An', 4, 'Kỹ thuật phần mềm'),
	(4, 'Trần Mai Linh', 'female', '2004-07-21', 'Hà Nội', '0904444555', 'linh.tran@sv.edu.vn', '20221110', 'Hà Nội', 3, 'Khoa học dữ liệu');

-- Dumping structure for table ktx_db.support_request
DROP TABLE IF EXISTS `support_request`;
CREATE TABLE IF NOT EXISTS `support_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `time_request` datetime DEFAULT CURRENT_TIMESTAMP,
  `request_content` text COLLATE utf8mb4_unicode_ci,
  `request_status` enum('pending','in_progress','done') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `manager_handle_id` int DEFAULT NULL,
  `request_type_id` int DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `student_id` (`student_id`),
  KEY `manager_handle_id` (`manager_handle_id`),
  CONSTRAINT `support_request_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `support_request_ibfk_2` FOREIGN KEY (`manager_handle_id`) REFERENCES `managers` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.support_request: ~2 rows (approximately)
DELETE FROM `support_request`;
INSERT INTO `support_request` (`request_id`, `student_id`, `time_request`, `request_content`, `request_status`, `manager_handle_id`, `request_type_id`) VALUES
	(1, 1, '2025-11-16 00:09:19', 'Bóng đèn phòng A1-101 bị hỏng.', 'in_progress', 1, NULL),
	(2, 2, '2025-11-16 00:09:19', 'Xin chuyển sang phòng có bạn cùng lớp.', 'pending', 2, NULL);

-- Dumping structure for table ktx_db.support_request_types
DROP TABLE IF EXISTS `support_request_types`;
CREATE TABLE IF NOT EXISTS `support_request_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.support_request_types: ~0 rows (approximately)
DELETE FROM `support_request_types`;
INSERT INTO `support_request_types` (`id`, `name`, `is_active`) VALUES
	(1, 'Yêu cầu sửa chữa', 1),
	(2, 'Yêu cầu vệ sinh', 1),
	(3, 'Yêu cầu hành chính', 1),
	(4, 'Yêu cầu an ninh', 1),
	(5, 'Yêu cầu liên quan đến tài chính', 1),
	(6, 'Yêu cầu khác', 1);

-- Dumping structure for table ktx_db.sys_users
DROP TABLE IF EXISTS `sys_users`;
CREATE TABLE IF NOT EXISTS `sys_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_role` enum('student','manager','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'student',
  `user_ref_id` int DEFAULT NULL,
  `user_status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ktx_db.sys_users: ~8 rows (approximately)
DELETE FROM `sys_users`;
INSERT INTO `sys_users` (`user_id`, `username`, `password`, `user_role`, `user_ref_id`, `user_status`) VALUES
	(1, '20225111', '123456', 'student', 1, 'active'),
	(2, '20234567', '123456', 'student', 2, 'active'),
	(3, '20217778', '123456', 'student', 3, 'active'),
	(4, '20221110', '123456', 'student', 4, 'active'),
	(5, 'an.nguyen@ktx.edu.vn', 'admin123', 'manager', 1, 'active'),
	(6, 'binh.tran@ktx.edu.vn', 'admin123', 'manager', 2, 'active'),
	(7, '0905123456', 'admin123', 'manager', 1, 'active'),
	(8, '0987456123', 'admin123', 'manager', 2, 'active');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
