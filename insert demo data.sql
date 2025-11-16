USE ktx_db;

-- =========================================
-- Kỳ ở (học kỳ / năm học)
-- =========================================
INSERT INTO period_stay (time_start, time_end, period_number, period_year)
VALUES 
('2025-09-01', '2026-01-15', 1, 2025),
('2026-01-15', '2026-06-30', 2, 2025),
('2026-07-01', '2026-08-31', 3, 2025);

-- =========================================
-- Tòa nhà ký túc xá
-- =========================================
INSERT INTO buildings (building_name, building_gender, descriptions)
VALUES 
('A1', 'male', 'Ký túc xá nam - khu A'),
('A2', 'female', 'Ký túc xá nữ - khu A'),
('B1', 'mixed', 'Ký túc xá chung - khu B');

-- =========================================
-- Loại phòng
-- =========================================
INSERT INTO room_types (building_id, capacity, room_price, descriptions)
VALUES 
(1, 8, 2400000, 'Phòng 8 người, có điều hòa, nóng lạnh.'),
(2, 10, 2000000, 'Phòng 10 người, có điều hòa, nóng lạnh'),
(3, 10, 1000000, 'Phòng 10 người, không có điều hòa và nóng lạnh');

-- =========================================
-- Phòng ở
-- =========================================
INSERT INTO rooms (room_name, building_id, room_type_id, room_status, note)
VALUES
('A1-101', 1, 3, 'available', 'Phòng tầng 1'),
('A1-102', 1, 3, 'available', 'Phòng tầng 1'),
('A2-201', 2, 2, 'available', 'Phòng tầng 2'),
('B1-301', 3, 1, 'available', 'Phòng tầng 3');

-- =========================================
-- Cán bộ quản lý ký túc xá
-- =========================================
INSERT INTO managers (manager_name, manager_address, manager_phone, manager_CCCD, manager_email)
VALUES
('Nguyễn Văn An', '123 Nguyễn Trãi, Hà Nội', '0905123456', '012345678900', 'an.nguyen@ktx.edu.vn'),
('Trần Thị Bình', '45 Hai Bà Trưng, Hà Nội', '0987456123', '098765432111', 'binh.tran@ktx.edu.vn');

-- =========================================
-- Sinh viên
-- =========================================
INSERT INTO students (student_name, gender, dob, student_address, student_phone, student_email, student_MSSV, province, year_of_study, major)
VALUES
('Lê Minh Hoàng', 'male', '2004-03-15', 'Thanh Hóa', '0901111222', 'hoang.le@sv.edu.vn', '20225111', 'Thanh Hóa', 3, 'Khoa học máy tính'),
('Nguyễn Thu Trang', 'female', '2004-09-05', 'Bắc Ninh', '0902222333', 'trang.nguyen@sv.edu.vn', '20234567', 'Bắc Ninh', 3, 'Công nghệ thông tin'),
('Phạm Anh Tuấn', 'male', '2003-12-01', 'Nghệ An', '0903333444', 'tuan.pham@sv.edu.vn', '20217778', 'Nghệ An', 4, 'Kỹ thuật phần mềm'),
('Trần Mai Linh', 'female', '2004-07-21', 'Hà Nội', '0904444555', 'linh.tran@sv.edu.vn', '20221110', 'Hà Nội', 3, 'Khoa học dữ liệu');

-- =========================================
-- Tài khoản hệ thống
-- (Sinh viên: login bằng MSSV, Cán bộ: login bằng email hoặc phone)
-- =========================================
INSERT INTO sys_users (username, password, user_role, user_ref_id)
VALUES
('20225111', '123456', 'student', 1),
('20234567', '123456', 'student', 2),
('20217778', '123456', 'student', 3),
('20221110', '123456', 'student', 4),
('an.nguyen@ktx.edu.vn', 'admin123', 'manager', 1),
('binh.tran@ktx.edu.vn', 'admin123', 'manager', 2),
('0905123456', 'admin123', 'manager', 1),
('0987456123', 'admin123', 'manager', 2);

-- =========================================
-- Gán cán bộ phụ trách tòa theo kỳ
-- =========================================
INSERT INTO manager_building (manager_id, building_id, period_id)
VALUES
(1, 1, 1),
(2, 2, 1);

-- =========================================
-- Form đăng ký ở của sinh viên
-- =========================================
INSERT INTO form_register (student_id, preferred_building_id, preferred_room_type_id, form_status, is_special, preferences)
VALUES
(1, 1, 3, 'pending', 0, '{"province":"Thanh Hoa","sleep":"early"}'),
(2, 2, 2, 'pending', 0, '{"province":"Bac Ninh","sleep":"late"}'),
(3, 1, 3, 'approved', 0, '{"province":"Nghe An","music":"rock"}'),
(4, 2, 2, 'pending', 1, '{"province":"Ha Noi","health":"special"}');

-- =========================================
-- Dữ liệu phân phòng (room_stay)
-- =========================================
INSERT INTO room_stay (period_id, room_id, student_id, start_date, end_date, stay_status, allocation_type)
VALUES
(1, 1, 1, '2025-08-10', '2026-05-30', 'active', 'auto'),
(1, 1, 3, '2025-08-10', '2026-05-30', 'active', 'auto');

-- =========================================
-- Thông báo
-- =========================================
INSERT INTO notification (notification_content, sender_id)
VALUES
('Ký túc xá sẽ tiến hành bảo trì hệ thống nước trong 2 ngày 5-6/9.', 1),
('Sinh viên cần hoàn tất đăng ký ở trước ngày 15/8.', 2);

-- =========================================
-- Người nhận thông báo
-- =========================================
INSERT INTO notification_receiver (notification_id, receiver_id, notification_receive_status)
VALUES
(1, 1, 'unread'),
(1, 2, 'read'),
(2, 3, 'unread'),
(2, 4, 'unread');

-- =========================================
-- Hóa đơn thanh toán
-- =========================================
INSERT INTO bill (payer_id, bill_status, creator_id, total_amount, descriptions)
VALUES
(1, 'paid', 1, 1000000, 'Tiền điện, nước, dịch vụ tháng 9'),
(3, 'unpaid', 1, 2000000, 'Tiền phòng kỳ 2 - 2025');

-- =========================================
-- Loại yêu cầu hỗ trợ
-- =========================================

INSERT INTO support_request_types (name, is_active) VALUES
('Yêu cầu sửa chữa', 1),
('Yêu cầu vệ sinh', 1),
('Yêu cầu hành chính', 1),
('Yêu cầu an ninh', 1),
('Yêu cầu liên quan đến tài chính', 1),
('Yêu cầu khác', 1)

-- =========================================
-- Yêu cầu hỗ trợ
-- =========================================
INSERT INTO support_request (student_id, request_content, request_status, manager_handle_id)
VALUES
(1, 'Bóng đèn phòng A1-101 bị hỏng.', 'in_progress', 1),
(2, 'Xin chuyển sang phòng có bạn cùng lớp.', 'pending', 2);
