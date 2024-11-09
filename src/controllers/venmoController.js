const admin = require('firebase-admin');

/**
 * Sets the Venmo link for a specific receipt.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.setVenmoLink = async (req, res) => {
  const { receipt_id, venmo_link } = req.body;

  console.log('Received Venmo request:', {
    receipt_id,
    venmo_link,
    venmoLinkType: typeof venmo_link,
    venmoLinkLength: venmo_link?.length,
    requestBody: req.body
  });

  // Basic validation
  if (!receipt_id || !venmo_link) {
    return res.status(400).json({
      success: false,
      message: 'Receipt ID and Venmo link are required.',
      debug: { received: { receipt_id, venmo_link } }
    });
  }

  try {
    // Simple URL validation
    const url = new URL(venmo_link);
    const isValidVenmo = url.hostname.includes('venmo.com') && 
                        url.pathname.startsWith('/u/') && 
                        url.pathname.length > 3;

    console.log('Venmo validation:', {
      url: url.toString(),
      hostname: url.hostname,
      pathname: url.pathname,
      isValid: isValidVenmo
    });

    if (!isValidVenmo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Venmo link format. Must be in format: https://venmo.com/u/username',
        debug: {
          receivedLink: venmo_link,
          hostname: url.hostname,
          pathname: url.pathname
        }
      });
    }

    const receiptRef = admin.firestore().collection('Receipts').doc(receipt_id);
    const receiptDoc = await receiptRef.get();

    if (!receiptDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found.',
      });
    }

    // Update the receipt with the Venmo link
    await receiptRef.update({
      venmo_link: venmo_link,
    });

    res.status(200).json({
      success: true,
      message: 'Venmo link saved successfully.',
      receiptData: {
        ...receiptDoc.data(),
        venmo_link
      }
    });
  } catch (error) {
    console.error('Error setting Venmo link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save Venmo link.',
      error: error.message,
    });
  }
}; 