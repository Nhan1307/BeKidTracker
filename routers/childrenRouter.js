const express = require("express");
const {
  addChild,
  getChildren,
  getChildById,
  updateChild,
  deleteChild
} = require("../controller/childrenController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addChild);
router.get("/", authMiddleware, getChildren);
router.get("/:id", authMiddleware, getChildById);
router.put("/:id", authMiddleware, updateChild);
router.delete("/:id", authMiddleware, deleteChild);

module.exports = router;
