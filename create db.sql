-- =========================================
-- CƠ SỞ DỮ LIỆU QUẢN LÝ KÝ TÚC XÁ
-- =========================================

CREATE DATABASE ktx_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ktx_db;

-- =========================================
-- BẢNG KỲ Ở (HỌC KỲ / NĂM HỌC)
-- =========================================
CREATE TABLE period_stay (
  period_id INT AUTO_INCREMENT PRIMARY KEY,
  time_start DATETIME NOT NULL,
  time_end DATETIME NOT NULL,
  period_number INT NOT NULL,
  period_year INT NOT NULL
);

-- =========================================
-- TÒA NHÀ KÝ TÚC XÁ
-- =========================================
CREATE TABLE buildings (
  building_id INT AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(128) NOT NULL,
  building_gender ENUM('male', 'female', 'mixed') DEFAULT 'mixed',
  address VARCHAR(1000),
  descriptions VARCHAR(1000)
);

-- =========================================
-- LOẠI PHÒNG
-- =========================================
CREATE TABLE room_types (
  room_type_id INT AUTO_INCREMENT PRIMARY KEY,
  building_id INT NOT NULL,
  capacity INT NOT NULL, -- số người/phòng
  room_price DECIMAL(12,2) NOT NULL, -- giá phòng trong 1 kỳ
  descriptions VARCHAR(256),
  FOREIGN KEY (building_id) REFERENCES buildings(building_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);


-- =========================================
-- PHÒNG Ở
-- =========================================
CREATE TABLE rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_name VARCHAR(128) NOT NULL,
  building_id INT NOT NULL,
  room_type_id INT NOT NULL,
  room_status ENUM('available', 'maintenance', 'full') DEFAULT 'available',
  note VARCHAR(512),
  FOREIGN KEY (building_id) REFERENCES buildings(building_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================================
-- THÔNG TIN SINH VIÊN
-- =========================================
CREATE TABLE students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(256) NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  dob DATE,
  student_address VARCHAR(1000),
  student_phone VARCHAR(15),
  student_email VARCHAR(128),
  student_MSSV VARCHAR(10) UNIQUE NOT NULL,
  province VARCHAR(128),
  year_of_study INT,
  major VARCHAR(256)
);

-- =========================================
-- TÀI KHOẢN HỆ THỐNG
-- =========================================
CREATE TABLE sys_users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(128) NOT NULL,
  user_role ENUM('student', 'manager', 'admin') DEFAULT 'student',
  user_ref_id INT, -- liên kết đến sinh viên hoặc cán bộ
  user_status ENUM('active', 'inactive') DEFAULT 'active'
);

-- =========================================
-- CÁN BỘ QUẢN LÝ
-- =========================================
CREATE TABLE managers (
  manager_id INT AUTO_INCREMENT PRIMARY KEY,
  manager_name VARCHAR(256) NOT NULL,
  manager_address VARCHAR(1000),
  manager_phone VARCHAR(15),
  manager_CCCD VARCHAR(15) UNIQUE,
  manager_email VARCHAR(128)
);

-- =========================================
-- QUẢN LÝ TÒA NHÀ THEO KỲ
-- =========================================
CREATE TABLE manager_building (
  manager_id INT NOT NULL,
  building_id INT NOT NULL,
  period_id INT NOT NULL,
  PRIMARY KEY (manager_id, building_id, period_id),
  FOREIGN KEY (manager_id) REFERENCES managers(manager_id),
  FOREIGN KEY (building_id) REFERENCES buildings(building_id),
  FOREIGN KEY (period_id) REFERENCES period_stay(period_id)
);

-- =========================================
-- ĐĂNG KÝ NGUYỆN VỌNG Ở (FORM)
-- =========================================
CREATE TABLE form_register (
  form_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  manager_id INT NULL,
  period_id INT NULL,
  time_register DATETIME DEFAULT CURRENT_TIMESTAMP,
  time_execute DATETIME NULL,
  preferred_building_id INT NULL,
  preferred_room_type_id INT NULL,
  preferred_roommate_id INT NULL,
  preferences JSON NULL, -- ví dụ: {"sleep":"early","music":"pop","province":"Hue"}
  form_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  is_special BIT DEFAULT 0,
  special_verification VARCHAR(256), -- link ảnh xác minh
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (preferred_building_id) REFERENCES buildings(building_id),
  FOREIGN KEY (preferred_room_type_id) REFERENCES room_types(room_type_id),
  FOREIGN KEY (preferred_roommate_id) REFERENCES students(student_id),
  FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
);

-- =========================================
-- GHI NHẬN QUÁ TRÌNH Ở THỰC TẾ
-- =========================================
CREATE TABLE room_stay (
  stay_id INT AUTO_INCREMENT PRIMARY KEY,
  period_id INT NOT NULL,
  room_id INT NOT NULL,
  student_id INT NOT NULL,
  start_date DATETIME,
  end_date DATETIME,
  stay_status ENUM('active', 'finished', 'cancelled') DEFAULT 'active',
  allocation_type ENUM('auto', 'manual') DEFAULT 'auto',
  FOREIGN KEY (period_id) REFERENCES period_stay(period_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- =========================================
-- LOẠI YÊU CẦU HỖ TRỢ
-- =========================================

CREATE TABLE support_request_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1    -- 1 = còn dùng, 0 = ngừng dùng
)

-- =========================================
-- YÊU CẦU HỖ TRỢ
-- =========================================
CREATE TABLE support_request (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  time_request DATETIME DEFAULT CURRENT_TIMESTAMP,
  request_type_id INT NOT NULL,
  request_content TEXT,
  request_status ENUM('pending', 'in_progress', 'done') DEFAULT 'pending',
  manager_handle_id INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (manager_handle_id) REFERENCES managers(manager_id)
);

-- =========================================
-- THÔNG BÁO
-- =========================================
CREATE TABLE notification (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  notification_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  notification_content TEXT,
  sender_id INT,
  notification_status ENUM('active', 'archived') DEFAULT 'active',
  FOREIGN KEY (sender_id) REFERENCES managers(manager_id)
);

-- =========================================
-- NGƯỜI NHẬN THÔNG BÁO
-- =========================================
CREATE TABLE notification_receiver (
  notification_id INT NOT NULL,
  receiver_id INT NOT NULL,
  notification_receive_status ENUM('unread', 'read') DEFAULT 'unread',
  PRIMARY KEY (notification_id, receiver_id),
  FOREIGN KEY (notification_id) REFERENCES notification(notification_id),
  FOREIGN KEY (receiver_id) REFERENCES students(student_id)
);

-- =========================================
-- HÓA ĐƠN THANH TOÁN
-- =========================================
CREATE TABLE bill (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  payer_id INT NOT NULL, -- student
  bill_status ENUM('unpaid', 'paid', 'cancelled') DEFAULT 'unpaid',
  bill_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  creator_id INT, -- manager
  total_amount DECIMAL(12,2) DEFAULT 0,
  descriptions TEXT,
  FOREIGN KEY (payer_id) REFERENCES students(student_id),
  FOREIGN KEY (creator_id) REFERENCES managers(manager_id)
);

-- =========================================
-- LỊCH SỬ HOẠT ĐỘNG (AUDIT LOG)
-- =========================================
CREATE TABLE activity_log (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action_type VARCHAR(100),
  action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  FOREIGN KEY (user_id) REFERENCES sys_users(user_id)
);
