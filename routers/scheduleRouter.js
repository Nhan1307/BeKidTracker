// routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();
const { addSchedule, getSchedulesByChild, getScheduleById, updateSchedule, deleteSchedule } = require("../controller/scheduleController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, addSchedule);
router.get("/child/:childId", authMiddleware, getSchedulesByChild);
router.get("/:id", authMiddleware, getScheduleById);
router.put("/:id", authMiddleware, updateSchedule);
router.delete("/:id", authMiddleware, deleteSchedule);

module.exports = router;
