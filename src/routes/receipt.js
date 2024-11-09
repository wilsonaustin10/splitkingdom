const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

// Route to fetch receipt details by receipt_id
router.get('/:id', receiptController.getReceiptById);

module.exports = router; 