import express from "express";
import {
  createRoom,
  getRoomsByBuilding,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
} from "../controllers/roomsController.js";
import {
  getStudentsByRoom,
  addStudentToRoom,
  deleteStudentFromRoom,
} from "../controllers/roomStudentsController.js";
import { authenticate, checkManagerBuilding } from "../middleware/auth.js";

const router = express.Router();

// Lấy danh sách phòng theo tòa
router.get("/building/:building_id", getRoomsByBuilding);

// Lấy danh sách sinh viên trong phòng
router.get(
  "/:room_id/students",
  authenticate,
  checkManagerBuilding,
  getStudentsByRoom
);

// Thêm sinh viên vào phòng
router.post(
  "/:room_id/students",
  authenticate,
  checkManagerBuilding,
  addStudentToRoom
);

// Xóa sinh viên khỏi phòng
router.delete(
  "/:room_id/students/:student_id",
  authenticate,
  checkManagerBuilding,
  deleteStudentFromRoom
);

// Tạo phòng
router.post("/", authenticate, checkManagerBuilding, createRoom);

// Cập nhật phòng
router.put("/:room_id", authenticate, checkManagerBuilding, updateRoom);

// Cập nhật trạng thái phòng
router.patch("/:room_id/status", authenticate, checkManagerBuilding, updateRoomStatus);

// Xóa phòng
router.delete("/:room_id", authenticate, checkManagerBuilding, deleteRoom);

export default router;
