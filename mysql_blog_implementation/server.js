const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB, closeDB } = require('./config/database');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

// Create Express app
const app = express();

// Connect to MySQL database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MySQL Blog API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MySQL'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to MySQL Blog API',
    version: '1.0.0',
    database: 'MySQL',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      health: '/api/health'
    },
    documentation: {
      users: {
        'POST /api/users': 'Create a new user',
        'GET /api/users': 'Get all users (supports pagination)',
        'GET /api/users/:id': 'Get user by ID',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user',
        'GET /api/users/:id/stats': 'Get user statistics'
      },
      posts: {
        'POST /api/posts': 'Create a new post',
        'GET /api/posts': 'Get all posts (supports pagination)',
        'GET /api/posts/trending': 'Get trending posts',
        'GET /api/posts/search': 'Search posts',
        'GET /api/posts/:id': 'Get post by ID',
        'PUT /api/posts/:id': 'Update post',
        'DELETE /api/posts/:id': 'Delete post',
        'POST /api/posts/:id/like': 'Toggle like on post',
        'POST /api/posts/:id/comments': 'Add comment to post',
        'GET /api/posts/user/:userId': 'Get posts by user'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);

  // Handle MySQL specific errors
  let statusCode = error.status || 500;
  let message = error.message || 'Internal Server Error';

  if (error.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'Duplicate entry error';
  } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Foreign key constraint error';
  } else if (error.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database connection refused';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      code: error.code
    })
  });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 MySQL Blog API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`💾 Database: MySQL`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await closeDB();
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(async () => {
    await closeDB();
    console.log('✅ Process terminated');
  });
});

module.exports = app;
