const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tipController');

// Route to handle tip updates
router.post('/', tipController.setTip);

module.exports = router; 