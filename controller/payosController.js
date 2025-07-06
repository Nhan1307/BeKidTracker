const axios = require('axios');
const PayosTransaction = require('../models/payosTransactionModel');

const config = {
  client_id: '76e7effe-959e-4063-8bcd-cbae3c89ff88',
  api_key: 'a32b46cf-a155-482b-b619-189fb630598e',
  endpoint: 'https://api.payos.vn/v2/payment-requests'
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, description, userId } = req.body;
    const orderCode = Math.floor(Math.random() * 1000000000).toString();
    const order = {
      amount,
      description,
      orderCode,
      returnUrl: 'https://c2de-2001-ee0-4fd7-f7a0-cdf1-4913-429f-1b0a.ngrok-free.app/payment-success',
      cancelUrl: 'https://c2de-2001-ee0-4fd7-f7a0-cdf1-4913-429f-1b0a.ngrok-free.app/payment-cancel'
    };
    const payosRes = await axios.post(
      config.endpoint,
      order,
      {
        headers: {
          'x-client-id': config.client_id,
          'x-api-key': config.api_key,
          'Content-Type': 'application/json'
        }
      }
    );
    const { checkoutUrl, id: payosTransactionId } = payosRes.data.data;
    const transaction = await PayosTransaction.create({
      orderCode,
      amount,
      description,
      status: 'pending',
      checkoutUrl,
      payosTransactionId,
      userId
    });
    res.json({ checkoutUrl, orderCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Nhận callback từ PayOS
exports.handleCallback = async (req, res) => {
  try {
    const { orderCode, status } = req.body;
    const transaction = await PayosTransaction.findOneAndUpdate(
      { orderCode },
      { status },
      { new: true }
    );
    res.status(200).json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách giao dịch
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await PayosTransaction.find().sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 