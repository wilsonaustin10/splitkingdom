# Split Kingdom Documentation

## 1. Core Features

### Image Capture
- Allows "Your Highness" to capture and upload a receipt photo in various formats.

### Receipt Parsing
- Uses Google Vision Document AI to interpret the layout and extract itemized details from the receipt.

### **Receipt Confirmation**
- Displays parsed receipt details for "Your Highness" to confirm the accuracy of items, total amount, and tax before setting the tip.
- Ensures that all parsed data is accurate and allows for verification to prevent any discrepancies.

### Bill Splitting
- Enables "Peasants" to choose items they ordered, automatically calculating their share based on selected items, tax, and tip.

### Cost Calculation
- **Tax and Tip Distribution:** "Your Highness" defines the tip for the total bill, and the app distributes both tax and tip proportionately based on each "Peasant's" individual bill.

### Payment Integration
- **Venmo Integration:**
  - After setting the tip, "Your Highness" inputs their Venmo profile link.
  - The total amount of the bill plus the applied tip is displayed for confirmation.
  - "Your Highness" saves their Venmo link, which is stored in Firestore.
  - "Peasants" are directed to "Your Highness'" Venmo profile via the provided link.
  - "Peasants" manually enter their calculated portion and complete the transaction on Venmo's platform.

### Final Bill Display
- **Total Amount Display:** Shows the sum of the receipt total and the tip.
- **Shareable Link:** Provides a link that can be copied or sent via SMS for "Peasants" to view and proceed with payments.

## 2. Goals & Objectives

### Primary Goal
- Simplify the bill-splitting process with a regal, fun user experience.
- Create a minimum viable product that can be deployed to a server and used by a small group of friends.

### Objectives
1. Ensure high accuracy in parsing diverse receipt formats.
2. Create a streamlined user experience with a Facebook-inspired theme.
3. Efficient payment process through direct Venmo profile links.

## 3. Tech Stack & Packages

### Backend
- **Node.js:** Server-side processing.
- **Express.js:** Web server framework for Node.js.
- **Google Vision Document AI:** For receipt parsing and text extraction.
- **Firebase Firestore:** Real-time database for managing session and receipt data.
- **Firebase Admin SDK:** For server-side interactions with Firestore.

### Frontend
- **HTML5 & CSS3:** Structured and styled using Tailwind CSS for a modern, responsive design.
- **JavaScript (Vanilla):** Handles interaction and dynamic content management without relying on frameworks.

### Packages
- **Express:** Web server framework for Node.js.
- **Firebase SDK & Firebase Admin SDK:** For Firestore integration.
- **Axios:** HTTP client for making API requests.
- **dotenv:** Manages environment variables for secure API keys.
- **Multer:** Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **@google-cloud/vision:** Client library for Google Vision Document AI.
- **nodemon:** Development utility for automatically restarting the server on file changes.
- **tailwindcss:** Utility-first CSS framework for styling.

## 4. Project Folder Structure

```plaintext
SplitKingdom/
├── public/
│   ├── index.html               # Main HTML file styled with a Facebook-inspired theme
│   ├── venmo.html               # Venmo Link Input page for "Your Royal Venmo Link"
│   ├── final-bill.html          # Final Bill Display page
│   ├── styles/                  # CSS files
│   └── scripts/                 # JavaScript files
│       └── upload.js             # Script handling upload and confirmation flows
├── src/
│   ├── app.js                   # Main server file
│   ├��─ routes/                  # Define routes
│   │   ├── upload.js             # Routes for handling receipt uploads
│   │   ├── tip.js                # Routes for handling tip updates
│   │   ├── venmo.js              # Routes for handling Venmo link submissions
│   │   └── receipt.js            # Routes for fetching receipt details
│   ├── controllers/             # Business logic and backend processing
│   │   ├── uploadController.js   # Controller for receipt uploads
│   │   ├── tipController.js      # Controller for tip updates
│   │   ├── venmoController.js    # Controller for Venmo link submissions
│   │   └── receiptController.js  # Controller for fetching receipt details
│   ├── config/                  # Config files, e.g., Firebase, Google Vision setup
│   │   ├── .env                  # Environment variables
│   │   ├── serviceAccountKey.json# Firebase service account credentials
│   │   └── document-ai-servicekey.json # Google Vision Document AI credentials
│   └── utils/                   # Helper functions, Venmo integration, etc.
│       └── vision.js             # Utility for interacting with Google Vision API
├── config/
│   └── .env                     # Environment variables
├── .gitignore                   # Specifies intentionally untracked files to ignore
├── SplitKingdom_Instructions.md # Project documentation
└── README.md                    # Project overview and setup instructions
```

## 5. Database Design

### Firestore Collections

#### Receipts
- `receipt_id`: Unique identifier.
- `items`: Array of items parsed from receipt (each with `name`, `price`, `quantity`, `category`).
- `total_amount`: Total amount on the receipt.
- `tax`: Tax amount on the receipt.
- `tip`: Defined by "Your Highness".
- `venmo_link`: Venmo profile URL of "Your Highness".
- `timestamp`: Time of receipt upload.

#### Users
- `user_id`: Unique identifier.
- `name`: User's name (Peasant or Your Highness).
- `venmo_link`: User's Venmo profile URL.
- `role`: Defines user as either "Your Highness" or "Peasant".

#### Sessions
- `session_id`: Unique identifier for the bill-splitting event.
- `receipt_id`: Associated receipt identifier.
- `participants`: Array of participant IDs (Peasants).
- `item_selection`: Mapping of items chosen by each Peasant, with weighted tax and tip calculated accordingly.

## 6. Landing Page Components

### Header
- **Split Kingdom Logo:** Represents the brand identity.
- **Navigation Menu:** Links to Home, Features, and Contact sections.
- **Call-to-Action Button:** "Begin Your Reign" to start the bill-splitting process.

### Main Banner
- **Slogan:** "Rule the Split, Reign with Ease" to convey the application's purpose.
- **CTA Button:** "Begin Your Reign" to engage users immediately.

### Feature Section
- **Core Features:** Icons and descriptions of primary functionalities like Receipt Parsing, Bill Splitting, and Venmo Payment.

### How It Works
- **Step-by-Step Guide:** Visual representation of the process from uploading a receipt to splitting the bill and completing payments.

### Receipt Confirmation Section
- **Parsed Receipt Details:** Displays items, tax, and total amount for "Your Highness" to verify before setting the tip.
- **Confirmation Button:** Allows "Your Highness" to proceed once verification is complete.

### Tip Definition Form
- **Tip Input:** Enables "Your Highness" to enter the desired tip amount after confirming receipt details.
- **Submission Button:** Sets the tip and moves the process forward.

### **Total Confirmation Section**
- **Total Amount Display:** Shows the sum of the receipt total and the tip.
- **Confirmation Button:** Allows "Your Highness" to confirm the total amount before proceeding.

### Venmo Link Input Section
- **Venmo Input:** Allows "Your Highness" to input their Venmo profile link after confirming the total amount.
- **Submission Button:** Saves the Venmo link for payment processing.

### Footer
- **Links:** Directs to Terms of Service, Privacy Policy, Contact Information, and Social Media profiles.
- **Copyright**

## 7. Color Palette

### Primary Colors
- **Facebook-inspired Blue (#1877f2):** Dominant color for headers, buttons, and accents.
- **Soft Gray (#f0f2f5):** Background color to complement the primary blue.

### Text Colors
- **Primary Text (Dark Gray #333333):** For main content and headings.
- **Secondary Text (Medium Gray #666666):** For subheadings and less prominent text.

## 8. User Flow

1. **Upload Receipt:**
   - "Your Highness" uploads a receipt image through the **Image Capture** form.
   - A loading spinner indicates processing.
   
2. **Receive Parsed Data:**
   - The receipt is parsed using Google Vision Document AI.
   - Parsed details are displayed in the **Receipt Confirmation Section**.

3. **Confirm Receipt Details:**
   - "Your Highness" reviews the items, tax, and total amount.
   - Upon confirmation, proceeds to set the tip.

4. **Set Tip:**
   - "Your Highness" inputs the desired tip amount in the **Tip Definition Form**.
   - The tip is saved to Firestore.
   
5. **Display Total Amount:**
   - The application calculates the total amount (receipt total + tip).
   - The total is displayed in the **Total Confirmation Section**.

6. **Confirm Total:**
   - "Your Highness" confirms the total amount.
   - Upon confirmation, redirects to the **Final Bill Page** to input their Venmo profile link.

7. **Set Venmo Link:**
   - "Your Highness" inputs their Venmo profile link in the **Venmo Link Input Section**.
   - The Venmo link is saved to Firestore.
   
8. **Bill Splitting:**
   - "Peasants" select the items they ordered.
   - Individual shares are calculated based on selections, tax, and tip.

9. **Payment:**
   - "Peasants" navigate to "Your Highness'" Venmo profile via the provided link.
   - Each "Peasant" completes the payment of their calculated share.

## 9. Setup Instructions

### Prerequisites
- **Node.js & npm:** Ensure you have Node.js and npm installed on your machine.
- **Firebase Project:** Set up a Firebase project and generate a service account key.
- **Google Vision Document AI Credentials:** Obtain credentials for Google Vision Document AI.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/splitkingdom.git
   cd splitkingdom
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Rename `config/.env.example` to `config/.env`.
   - Populate the `.env` file with your Firebase and Google Vision credentials.
     ```
     FIREBASE_API_KEY=your_firebase_api_key
     JWT_SECRET=your_jwt_secret
     GOOGLE_VISION_API_KEY=path_to_your_google_vision_service_account_json
     PORT=3000
     ```

4. **Add Service Account Keys:**
   - Place your Firebase `serviceAccountKey.json` in the `config/` directory.
   - Place your Google Vision `document-ai-servicekey.json` in the `config/` directory.

5. **Update `.gitignore`:**
   - Ensure sensitive files are excluded from version control.
     ```
     node_modules/
     .env
     public/uploads/
     config/serviceAccountKey.json
     config/document-ai-servicekey.json
     ```

6. **Start the Server:**
   - For development with automatic restarts:
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

7. **Access the Application:**
   - Navigate to `http://localhost:3000` in your browser.

8. **Access Venmo Link Page:**
   - After confirming the total, you will be redirected to `http://localhost:3000/final-bill.html?receipt_id=YOUR_RECEIPT_ID`.

## 10. Security Considerations

- **Environment Variables:**
  - Store all sensitive information such as API keys and secrets in the `.env` file.
  - Never expose `.env` or service account keys in version control.
  
- **Input Validation & Sanitization:**
  - Validate and sanitize all user inputs to prevent security vulnerabilities.
  
- **Secure API Endpoints:**
  - Use JWT authentication to protect sensitive routes.
  - Ensure only authorized users can access and modify data.

## 11. Testing

- **Receipt Upload:**
  - Upload various receipt formats to ensure accurate parsing and display.
  
- **Tip Setting:**
  - Test tip input with valid and invalid values to ensure proper validation and storage.
  
- **Total Confirmation:**
  - Verify that the total amount is correctly calculated and displayed after setting the tip.
  - Ensure that confirmation correctly redirects to the Final Bill Page.
  
- **Venmo Link Submission:**
  - Input valid and invalid Venmo links to verify validation and storage.
  
- **Bill Splitting:**
  - Simulate "Peasants" selecting items and verify correct share calculations.
  
- **Payment Flow:**
  - Ensure Venmo links redirect correctly and pre-fill the necessary payment information.

## 12. Future Enhancements

While this application serves as an MVP, the following features can be considered for future versions:

1. **Advanced Receipt Parsing:**
   - Implement machine learning models to enhance parsing accuracy across diverse receipt formats.
  
2. **User Authentication:**
   - Introduce user accounts with authentication to personalize experiences and secure data.
  
3. **Role-Based Access Control (RBAC):**
   - Differentiate permissions between "Your Highness" and "Peasants" for enhanced security.
  
4. **Real-Time Updates:**
   - Utilize Firestore's real-time capabilities to update bill splits and payments dynamically.
  
5. **Enhanced UI/UX:**
   - Refine the design with more interactive elements and responsive layouts for better user engagement.
  
6. **Notifications:**
   - Implement email or in-app notifications to inform "Peasants" when payments are due or completed.

## 13. Deployment

1. **Choose a Hosting Platform:**
   - Deploy the backend on platforms like Heroku, Vercel, or AWS.
   - Ensure environment variables are securely managed on the hosting platform.
  
2. **Set Up Continuous Integration/Continuous Deployment (CI/CD):**
   - Automate testing and deployment processes to streamline updates.
  
3. **Monitor and Scale:**
   - Use monitoring tools to track application performance.
   - Scale resources based on user demand and application load.

## 14. Contact & Support

For any issues, suggestions, or contributions, please contact:

- **Email:** support@splitkingdom.com
- **GitHub:** [https://github.com/yourusername/splitkingdom](https://github.com/yourusername/splitkingdom)
- **Social Media:** Follow us on [Facebook](https://facebook.com/splitkingdom) and [Twitter](https://twitter.com/splitkingdom).

---

**Note:** This documentation is a living document and will be updated as the application evolves. Ensure to refer to the latest version for accurate and comprehensive information.