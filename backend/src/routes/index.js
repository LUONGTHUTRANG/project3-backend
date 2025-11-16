import express from "express";

import buildings from "./buildings.js";
import auth from "./auth.js";
import registrations from "./registrations.js";
import support from "./support.js";
import notifications from "./notifications.js";

const router = express.Router();

router.use("/buildings", buildings);
router.use("/auth", auth);
router.use("/registrations", registrations);
router.use("/support", support);
router.use("/notifications", notifications);

// TODO: add routes for rooms, staff, payments, students

router.get("/", (req, res) => res.json({ ok: true }));

export default router;
