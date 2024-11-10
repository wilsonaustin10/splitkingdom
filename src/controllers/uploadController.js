const multer = require('multer');
const path = require('path');
const { parseReceipt } = require('../utils/vision'); // Import the Vision utility
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // For local development
  serviceAccount = require('../../config/serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://split-kingdom.firebaseio.com', // Replace with your Firebase database URL
});

const db = admin.firestore();

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
}).single('receipt'); // 'receipt' is the field name

// Controller function
exports.processUpload = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });
    }

    try {
      // Parse the uploaded receipt using Google Vision
      const parsedData = await parseReceipt(req.file.path);

      // Structure the data as per Firestore Collections
      const receiptId = db.collection('Receipts').doc().id;
      const receiptData = {
        receipt_id: receiptId,
        items: parsedData.items,
        total_amount: parsedData.total_amount,
        tax: parsedData.tax,
        tip: 0, // To be defined by "Your Highness"
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Save the receipt data to Firestore
      await db.collection('Receipts').doc(receiptId).set(receiptData);

      res.status(200).json({
        success: true,
        message: 'File uploaded and parsed successfully',
        filePath: `/uploads/${req.file.filename}`,
        receiptData,
      });
    } catch (parseError) {
      res.status(500).json({
        success: false,
        message: 'Failed to parse receipt',
        error: parseError.message,
      });
    }
  });
}; 