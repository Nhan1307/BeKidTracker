const axios = require('axios');
const PayosTransaction = require('../models/payosTransactionModel');
const config = {
  client_id: process.env.PAYOS_CLIENT_ID,
  api_key: process.env.PAYOS_API_KEY,
  checksum_key: process.env.PAYOS_CHECKSUM_KEY,
  endpoint: process.env.PAYOS_ENDPOINT
};


exports.createOrder = async (req, res) => {
  try {
    const { amount, description, userId } = req.body;
    const orderCodeNumber =orderCode? Number(orderCode) : Math.floor(Math.random() * 1000000000);
    const data = `amount=${amount}&cancelUrl=${process.env.PAYOS_CANCEL_URL}&description=${description}&orderCode=${orderCodeNumber}&returnUrl=${process.env.PAYOS_RETURN_URL}`;
    const signature = require('crypto')
      .createHmac('sha256', process.env.PAYOS_CHECKSUM_KEY)
      .update(data)
      .digest('hex');


    const order = {
      amount,
      description,
      orderCode :  orderCodeNumber,
     returnUrl: process.env.PAYOS_RETURN_URL,
     cancelUrl: process.env.PAYOS_CANCEL_URL,
     signature
    };
    const payosRes = await axios.post(
      config.endpoint +'/v2/payment-requests',
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
      console.error('Lỗi tạo đơn hàng PayOS:', err.response ? err.response.data : err);
    res.status(500).json({ error: err.response ? err.response.data : err.message });
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
