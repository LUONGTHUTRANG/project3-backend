import express from "express";
import {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, requireRole("admin"), createStaff);
router.get("/", authenticate, requireRole("admin"), getAllStaff);
router.put("/:manager_id", authenticate, requireRole("admin"), updateStaff);
router.delete("/:manager_id", authenticate, requireRole("admin"), deleteStaff);

export default router;
