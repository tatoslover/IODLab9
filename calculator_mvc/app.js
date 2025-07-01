/**
 * Simple Calculator Application - Main Server File
 *
 * This is the main Express.js application file that sets up the server
 * with proper MVC architecture, middleware configuration, and error handling.
 *
 * Features:
 * - Express server setup with CORS and security middleware
 * - Static file serving for the frontend
 * - Calculator API routes with validation
 * - Comprehensive error handling
 * - Request logging and monitoring
 * - Health check endpoints
 * - Graceful shutdown handling
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const calculatorRoutes = require('./routes/calculatorRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

// ===== MIDDLEWARE CONFIGURATION =====

// CORS configuration - allow frontend to connect
app.use(cors({
  origin: ['http://localhost:3004', 'http://localhost:3000', 'http://127.0.0.1:3004'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request logging - different formats for development vs production
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Static file serving - serve the calculator frontend
app.use(express.static(path.join(__dirname, 'views')));

// Request timing middleware for performance monitoring
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// ===== ROUTE CONFIGURATION =====

// Root route - serve the calculator HTML interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'calculator.html'));
});

// Calculator API routes
app.use('/calculator', calculatorRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    service: 'Simple Calculator API',
    version: '2.0.0',
    description: 'RESTful calculator API with MVC architecture - Basic Operations Only',
    author: 'IOD Student',
    features: [
      'Basic arithmetic operations (add, subtract, multiply, divide)',
      'Calculation history tracking',
      'Usage statistics',
      'Input validation and error handling',
      'RESTful API design',
      'Health monitoring'
    ],
    endpoints: {
      frontend: 'GET /',
      documentation: 'GET /api',
      calculator: 'GET /calculator',
      health: 'GET /health'
    },
    examples: {
      addition: '/calculator/add?num1=5&num2=3',
      subtraction: '/calculator/subtract?num1=10&num2=4',
      multiplication: '/calculator/multiply?num1=6&num2=7',
      division: '/calculator/divide?num1=20&num2=4',
      history: '/calculator/history?limit=10'
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    service: 'Simple Calculator API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      unit: 'MB'
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid
    }
  };

  res.status(200).json(healthStatus);
});

// ===== ERROR HANDLING MIDDLEWARE =====

// 404 handler - route not found
app.use('*', (req, res) => {
  const responseTime = Date.now() - req.startTime;

  res.status(404).json({
    success: false,
    error: 'Route not found',
    service: 'Simple Calculator API',
    requestedPath: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    suggestions: [
      'Try GET / for the calculator interface',
      'Try GET /api for API documentation',
      'Try GET /calculator for calculator operations',
      'Try GET /health for health check'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const responseTime = Date.now() - req.startTime;

  console.error('Global Error Handler:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't expose stack traces in production
  const errorResponse = {
    success: false,
    error: 'Internal server error',
    service: 'Simple Calculator API',
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    requestId: req.headers['x-request-id'] || 'unknown'
  };

  // Include more details in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.details = {
      message: err.message,
      path: req.path,
      method: req.method
    };
  }

  res.status(err.status || 500).json(errorResponse);
});

// ===== SERVER STARTUP =====

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n📴 Received ${signal}. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }

    console.log('✅ Server closed successfully');
    console.log('👋 Calculator API shutdown complete');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Start the server
const server = app.listen(PORT, () => {
  console.log('\n🧮 ===== SIMPLE CALCULATOR API =====');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Calculator Interface: http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log(`   • Calculator UI: GET http://localhost:${PORT}/`);
  console.log(`   • Add Numbers: GET http://localhost:${PORT}/calculator/add?num1=5&num2=3`);
  console.log(`   • Subtract: GET http://localhost:${PORT}/calculator/subtract?num1=10&num2=4`);
  console.log(`   • Multiply: GET http://localhost:${PORT}/calculator/multiply?num1=6&num2=7`);
  console.log(`   • Divide: GET http://localhost:${PORT}/calculator/divide?num1=20&num2=4`);
  console.log(`   • History: GET http://localhost:${PORT}/calculator/history`);
  console.log(`   • Statistics: GET http://localhost:${PORT}/calculator/stats`);
  console.log('');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🆔 Process ID: ${process.pid}`);
  console.log(`📅 Started: ${new Date().toLocaleString()}`);
  console.log('=====================================\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

module.exports = app;
