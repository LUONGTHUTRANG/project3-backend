import express from "express";
import {
  createRegistration,
  getRegistrationByStudentId,
  handleRegistration,
} from "../controllers/registrationsController.js";

const router = express.Router();

// Đăng ký vào ở ký túc xá
router.post("/", createRegistration);

// Lấy form đăng ký theo student_id
router.get("/:student_id", getRegistrationByStudentId);

// Xử lý form đăng ký (update trạng thái)
router.put("/", handleRegistration);

export default router;
