const express = require('express');
const router = express.Router();
const payosController = require('../controller/payosController');

router.post('/create-order', payosController.createOrder);
router.post('/callback', payosController.handleCallback);
router.get('/transactions', payosController.getTransactions);

module.exports = router; 