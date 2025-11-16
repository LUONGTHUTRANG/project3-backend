import express from "express";
import {
  createSupportRequest,
  getSupportRequests,
  handleSupportRequest,
} from "../controllers/supportRequestsController.js";

const router = express.Router();

// Tạo yêu cầu hỗ trợ
router.post("/", createSupportRequest);

// Lấy danh sách yêu cầu hỗ trợ theo request_type_id và request_status (tùy chọn)
router.get("/", getSupportRequests);

// Xử lý yêu cầu hỗ trợ (update request_status)
router.put("/", handleSupportRequest);

export default router;
