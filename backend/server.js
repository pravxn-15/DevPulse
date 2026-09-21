require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Enable CORS for frontend integration
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'DevPulse Node.js Express REST API Server with Database Integration is running smoothly!',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login'],
      blogs: ['GET /api/blogs', 'GET /api/blogs/:id', 'POST /api/blogs', 'DELETE /api/blogs/:id']
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Internal Error', error: err.message });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`⚡ DevPulse Express API Server running on port ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
  console.log(`===================================================`);
});
