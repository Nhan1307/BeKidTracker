const UserModel = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const Evaluation = require("../models/evalutionModel");

// Lấy tổng hợp số liệu dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalEvaluations = await Evaluation.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);
    const revenue = totalRevenue[0]?.sum || 0;

    // Số lượng từng gói đã bán
    const packageStats = await Transaction.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: "$description", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    res.json({
      totalUsers,
      totalTransactions,
      totalEvaluations,
      revenue,
      packageStats
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Lấy danh sách giao dịch (có phân trang, lọc)
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, description } = req.query;
    const query = {};
    if (status) query.status = status;
    if (description) query.description = description;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({ total, transactions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 