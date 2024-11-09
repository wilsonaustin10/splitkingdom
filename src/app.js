const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const uploadRoutes = require('./routes/upload'); // Import upload routes
const tipRoutes = require('./routes/tip'); // Import tip routes
const venmoRoutes = require('./routes/venmo'); // Import Venmo routes
const receiptRoutes = require('./routes/receipt'); // Import receipt routes

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '192.168.86.248';  // This allows connections from any network interface

// Debug: Add this to verify environment variables are loaded
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  // Log other non-sensitive env vars for debugging
});

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API routes first
app.use('/api/upload', uploadRoutes);
app.use('/api/tip', tipRoutes);
app.use('/api/venmo', venmoRoutes);
app.use('/api/receipt', receiptRoutes);

// HTML route handlers
app.get(['/share', '/share.html'], (req, res) => {
  console.log('Share route hit:', req.url);  // Add this debug log
  console.log('Query params:', req.query);   // Add this debug log
  res.sendFile(path.join(__dirname, '../public/peasant-item-selection.html'));
});

// Static files last
app.use(express.static(path.join(__dirname, '../public')));

// 404 handler
app.use((req, res) => {
  console.log('404 hit:', req.url);  // Add this debug log
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Access locally via http://localhost:${PORT}`);
  console.log(`Access on network via http://YOUR_IP:${PORT}`);
});

// After dotenv.config()
console.log('Environment check:', {
  GOOGLE_VISION_API_KEY: process.env.GOOGLE_VISION_API_KEY,
  PORT: process.env.PORT,
  // Don't log JWT_SECRET or other sensitive values
});
