const express = require("express");
const {
  createThoiGianBieu,
  getThoiGianBieuByChild,
  updateThoiGianBieu,
  deleteThoiGianBieu,
} = require("../controller/thoiGianBieuController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:childId", authMiddleware, createThoiGianBieu);
router.put("/:id", authMiddleware, updateThoiGianBieu);
router.get("/:childId", authMiddleware, getThoiGianBieuByChild);
router.delete("/:id", authMiddleware, deleteThoiGianBieu);


module.exports = router;
