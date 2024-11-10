const vision = require('@google-cloud/vision');
const path = require('path');

// Initialize the client with the correct authentication
let client;

try {
  // Check if we're in production (Render.com)
  if (process.env.NODE_ENV === 'production') {
    // Use environment variable
    const credentials = JSON.parse(process.env.GOOGLE_VISION_SERVICE_ACCOUNT);
    client = new vision.ImageAnnotatorClient({
      credentials: credentials
    });
    console.log('Vision API Client initialized with environment variables');
  } else {
    // Use local file for development
    const keyFilePath = path.join(__dirname, '../../config/document-ai-servicekey.json');
    client = new vision.ImageAnnotatorClient({
      keyFilename: keyFilePath
    });
    console.log('Vision API Client initialized with local file:', keyFilePath);
  }
} catch (error) {
  console.error('Error initializing Vision API client:', error);
  throw error;
}

/**
 * Parses a receipt image using Google Vision Document AI
 * @param {string} imagePath - Path to the receipt image
 * @returns {Promise<Object>} - Parsed receipt data
 */
const parseReceipt = async (imagePath) => {
  try {
    console.log('Attempting to parse receipt:', imagePath);
    
    const [result] = await client.documentTextDetection(imagePath);
    
    if (!result || !result.fullTextAnnotation) {
      throw new Error('No text detected in image');
    }
    
    const fullText = result.fullTextAnnotation.text;
    console.log('Detected text:', fullText);
    
    const parsedData = {
      items: [],
      total_amount: 0,
      tax: 0,
    };

    const lines = fullText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Process lines in pairs since item and price are on separate lines
    for (let i = 0; i < lines.length - 1; i++) {
      const currentLine = lines[i];
      const nextLine = lines[i + 1];
      
      // Check for tax
      if (currentLine.toLowerCase() === 'tax' && nextLine.startsWith('$')) {
        parsedData.tax = parseFloat(nextLine.replace('$', ''));
        continue;
      }
      
      // Check for total
      if (currentLine.toLowerCase() === 'total' && nextLine.startsWith('$')) {
        parsedData.total_amount = parseFloat(nextLine.replace('$', ''));
        continue;
      }
      
      // Check for items (starts with a number)
      if (/^\d+/.test(currentLine) && nextLine.startsWith('$')) {
        const [quantity, ...nameParts] = currentLine.split(' ');
        const itemName = nameParts.join(' ');
        const price = parseFloat(nextLine.replace('$', ''));
        
        parsedData.items.push({
          name: itemName,
          price: price,
          quantity: parseInt(quantity)
        });
        
        // Skip the price line since we've processed it
        i++;
      }
    }

    console.log('Parsed Data:', parsedData);
    return parsedData;
    
  } catch (error) {
    console.error('Error parsing receipt:', error);
    throw error;
  }
};

module.exports = { parseReceipt }; 