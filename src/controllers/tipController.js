const admin = require('firebase-admin');

/**
 * Sets the tip amount for a specific receipt.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.setTip = async (req, res) => {
  // Log the raw request body
  console.log('Raw request body:', req.body);
  
  const { receipt_id } = req.body;
  const tip_amount = parseFloat(req.body.tip_amount);
  
  console.log('Parsed values:', {
    receipt_id,
    tip_amount,
    typeofTip: typeof tip_amount
  });

  if (!receipt_id || isNaN(tip_amount)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid receipt ID or tip amount.',
      debug: {
        receivedTip: req.body.tip_amount,
        parsedTip: tip_amount
      }
    });
  }

  try {
    const receiptRef = admin.firestore().collection('Receipts').doc(receipt_id);
    const receiptDoc = await receiptRef.get();

    if (!receiptDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found.',
      });
    }

    await receiptRef.update({
      tip: tip_amount,
    });

    res.status(200).json({
      success: true,
      message: 'Tip updated successfully.',
      receiptData: {
        ...receiptDoc.data(),
        tip: tip_amount,
      }
    });
  } catch (error) {
    console.error('Error updating tip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tip.',
      error: error.message,
    });
  }
}; 