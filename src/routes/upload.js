const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Route to handle image upload
router.post('/', uploadController.processUpload);

module.exports = router; 