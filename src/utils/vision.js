const vision = require('@google-cloud/vision');
const path = require('path');

// Initialize the client with the correct authentication
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../../config/document-ai-servicekey.json')
});

console.log('Vision API Client initialization path:', path.join(__dirname, '../../config/document-ai-servicekey.json'));
console.log('Vision API Client initialized:', !!client);

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