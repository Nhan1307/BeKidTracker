const mongoose = require('mongoose');

const payosTransactionSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  checkoutUrl: { type: String },
  payosTransactionId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

module.exports = mongoose.model('PayosTransaction', payosTransactionSchema); 