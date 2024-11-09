const admin = require('firebase-admin');

/**
 * Fetches receipt details by receipt_id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getReceiptById = async (req, res) => {
  const receiptId = req.params.id;

  if (!receiptId) {
    return res.status(400).json({
      success: false,
      message: 'Receipt ID is required.',
    });
  }

  try {
    const receiptRef = admin.firestore().collection('Receipts').doc(receiptId);
    const receiptDoc = await receiptRef.get();

    if (!receiptDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found.',
      });
    }

    res.status(200).json({
      success: true,
      receiptData: receiptDoc.data(),
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipt.',
      error: error.message,
    });
  }
}; 