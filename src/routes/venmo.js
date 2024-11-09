const express = require('express');
const router = express.Router();
const venmoController = require('../controllers/venmoController');

// Route to handle Venmo link submissions
router.post('/', venmoController.setVenmoLink);

module.exports = router; 