const express = require("express");
const { completeEvaluation, getEvaluationByChildAndDate, updateEvaluation } = require("../controller/evaluationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/complete", authMiddleware, completeEvaluation);
router.put("/update", authMiddleware, updateEvaluation); // route cập nhật đánh giá
router.get("/get-evaluation", authMiddleware, getEvaluationByChildAndDate);

module.exports = router;
