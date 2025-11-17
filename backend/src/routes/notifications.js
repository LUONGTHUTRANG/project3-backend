import express from "express";
import {
  createNotification,
  getNotificationById,
  getNotificationsByStudent,
  markNotificationAsRead,
  archiveNotification,
  getNotificationsBySender,
} from "../controllers/notificationsController.js";

const router = express.Router();

// Tạo thông báo mới
router.post("/", createNotification);

// Lấy danh sách thông báo đã gửi
router.get("/sent/:sender_id", getNotificationsBySender);

// Lấy danh sách thông báo của sinh viên
router.get("/student/:student_id", getNotificationsByStudent);

// Lấy thông báo theo ID
router.get("/:notification_id", getNotificationById);

// Đánh dấu thông báo là đã đọc
router.put("/read", markNotificationAsRead);

// Lưu trữ thông báo
router.put("/archive", archiveNotification);

export default router;
