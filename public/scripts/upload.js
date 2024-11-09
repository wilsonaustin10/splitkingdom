document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const uploadStatus = document.getElementById('uploadStatus');
  const loadingSpinner = document.getElementById('receipt-loading');
  const tipSection = document.getElementById('tip-definition');
  const tipForm = document.getElementById('tipForm');
  const tipStatus = document.getElementById('tipStatus');
  const receiptSection = document.getElementById('receipt-confirmation');
  const receiptDetails = document.getElementById('receiptDetails');
  const confirmReceiptBtn = document.getElementById('confirmReceipt');
  const totalSection = document.getElementById('total-confirmation');
  const totalAmountSpan = document.getElementById('totalAmount');
  const confirmTotalBtn = document.getElementById('confirmTotal');
  const venmoLinkSection = document.getElementById('venmo-link-section');
  const venmoStatus = document.getElementById('venmoStatus');
  let currentReceiptId = null;

  if (!uploadForm || !uploadStatus || !loadingSpinner) {
    console.error('Required DOM elements not found');
    return;
  }

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('receiptImage');
    const file = fileInput?.files[0];
    
    if (!file) {
      uploadStatus.innerText = 'Please select a file to upload.';
      return;
    }
    
    try {
      if (loadingSpinner) {
        loadingSpinner.classList.remove('hidden');
      }
      uploadStatus.innerText = 'Processing your majesty\'s receipt...';
      
      const formData = new FormData();
      formData.append('receipt', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('Parsed response:', result);
      
      if (result.success) {
        uploadStatus.innerText = 'Upload successful!';
        
        console.log('Receipt data:', result.receiptData);
        
        if (!result.receiptData) {
          throw new Error('No receipt data in response');
        }
        
        currentReceiptId = result.receiptData.receipt_id;
        console.log('Set currentReceiptId:', currentReceiptId);
        
        const { items, total_amount, tax } = result.receiptData;
        
        console.log('Extracted data:', { items, total_amount, tax });
        
        if (!items) {
          throw new Error('Items array is missing from receipt data');
        }
        if (!Array.isArray(items)) {
          throw new Error(`Items is not an array: ${typeof items}`);
        }
        if (items.length === 0) {
          throw new Error('Items array is empty');
        }
        if (typeof total_amount !== 'number') {
          throw new Error(`Invalid total amount: ${total_amount}`);
        }
        if (typeof tax !== 'number') {
          throw new Error(`Invalid tax amount: ${tax}`);
        }
        
        let receiptHTML = `
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-[#1877f2] mb-4">Items</h3>
            <div class="space-y-2">
        `;
        
        console.log('Starting items loop with', items.length, 'items');
        
        items.forEach((item, index) => {
          console.log(`Processing item ${index}:`, item);
          
          if (!item.name || typeof item.price !== 'number') {
            console.error(`Invalid item at index ${index}:`, item);
            throw new Error(`Invalid item data at index ${index}`);
          }
          
          receiptHTML += `
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <div class="flex items-center">
                <span class="font-medium">${item.name}</span>
              </div>
              <span class="font-semibold">$${item.price.toFixed(2)}</span>
            </div>
          `;
        });
        
        receiptHTML += `
            </div>
            <div class="mt-6 space-y-3 border-t border-gray-200 pt-4">
              <div class="flex justify-between text-gray-600">
                <span>Tax</span>
                <span class="font-semibold">$${tax.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-[#1877f2]">
                <span>Total Amount:</span>
                <span>$${total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        `;
        
        console.log('Generated HTML:', receiptHTML);
        
        const receiptDetailsElement = document.getElementById('receiptDetails');
        if (!receiptDetailsElement) {
          throw new Error('Receipt details element not found in DOM');
        }
        
        receiptDetailsElement.innerHTML = receiptHTML;
        
        console.log('DOM updated with receipt details');
        
        receiptSection.classList.remove('hidden');
        uploadForm.classList.add('hidden');
        
        console.log('Updated visibility of receipt section and upload form');
        
      } else {
        throw new Error(result.message || 'Upload failed without error message');
      }
    } catch (error) {
      console.error('Detailed upload error:', error);
      console.error('Error stack:', error.stack);
      uploadStatus.innerText = `A royal error occurred: ${error.message}`;
      if (loadingSpinner) {
        loadingSpinner.classList.add('hidden');
      }
    } finally {
      if (loadingSpinner) {
        loadingSpinner.classList.add('hidden');
      }
    }
  });

  if (confirmReceiptBtn && receiptSection) {
    confirmReceiptBtn.addEventListener('click', () => {
      console.log('Confirm Receipt button clicked');
      console.log('Receipt ID at confirmation:', currentReceiptId);
      receiptSection.classList.add('hidden');
      tipSection.classList.remove('hidden');
    });
  }

  if (tipForm && tipStatus) {
    tipForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const tipInput = document.getElementById('tipAmount');
      const tipValue = parseFloat(tipInput.value);
      
      console.log('Submitting tip:', {
        tipValue,
        typeofTipValue: typeof tipValue,
        currentReceiptId
      });
      
      if (isNaN(tipValue) || tipValue < 0) {
        tipStatus.innerText = 'Please enter a valid tip amount.';
        return;
      }
      
      if (!currentReceiptId) {
        tipStatus.innerText = 'No receipt found. Please upload a receipt first.';
        return;
      }
      
      try {
        const requestBody = {
          receipt_id: currentReceiptId,
          tip_amount: tipValue
        };
        console.log('Sending request body:', requestBody);

        const response = await fetch('/api/tip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response body:', result);
        
        if (result.success) {
          tipStatus.innerText = 'Your Majesty\'s Tip has been set successfully!';
          tipForm.reset();
          
          // Calculate Total Amount
          const { total_amount } = result.receiptData;
          const total = total_amount + tipValue;
          totalAmountSpan.innerText = `$${total.toFixed(2)}`;
          
          // Show Total Confirmation Section
          totalSection.classList.remove('hidden');
          tipSection.classList.add('hidden');
        } else {
          tipStatus.innerText = `Failed to set tip: ${result.message}`;
        }
      } catch (error) {
        tipStatus.innerText = `An error occurred: ${error.message}`;
      }
    });
  }

  if (confirmTotalBtn && totalSection) {
    confirmTotalBtn.addEventListener('click', () => {
      // Redirect to Venmo Link Page with receipt_id as query parameter
      window.location.href = `./venmo.html?receipt_id=${currentReceiptId}`;
    });
  }

  if (venmoLinkSection && venmoStatus) {
    const venmoForm = document.getElementById('venmoForm');
    venmoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const venmoInput = document.getElementById('venmoLink');
      const venmoLink = venmoInput?.value.trim();
      
      // Updated Venmo validation
      try {
        const url = new URL(venmoLink);
        if (!url.hostname.includes('venmo.com') || !url.pathname.startsWith('/u/')) {
          venmoStatus.innerText = 'Please enter a valid Venmo link in the format: https://venmo.com/u/username';
          const example = document.createElement('div');
          example.className = 'text-sm text-gray-500 mt-2';
          example.innerText = 'Example: https://venmo.com/u/Austin-Wilson-3';
          venmoStatus.appendChild(example);
          return;
        }
      } catch (error) {
        venmoStatus.innerText = 'Please enter a valid URL';
        return;
      }
      
      try {
        const response = await fetch('/api/venmo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receipt_id: currentReceiptId,
            venmo_link: venmoLink,
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          venmoStatus.innerText = 'Venmo link saved successfully! You can now share your Venmo link with your Peasants.';
          if (venmoForm) venmoForm.reset();
        } else {
          venmoStatus.innerText = `Failed to save Venmo link: ${result.message}`;
        }
      } catch (error) {
        venmoStatus.innerText = `An error occurred: ${error.message}`;
      }
    });
  }
}); 