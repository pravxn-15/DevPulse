require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Robust CORS Configuration for Vercel, Netlify, and Localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or file://) or any web domain
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight across all routes

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for images and uploads
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Health Check & Base API Route
const getApiStatus = (req, res) => {
  res.json({
    status: 'success',
    message: 'DevPulse Node.js Express REST API Server with Database Integration is running smoothly!',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'PUT /api/auth/profile'],
      blogs: ['GET /api/blogs', 'GET /api/blogs/:id', 'POST /api/blogs', 'PUT /api/blogs/:id', 'DELETE /api/blogs/:id']
    }
  });
};

app.get('/', getApiStatus);
app.get('/api', getApiStatus);

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
