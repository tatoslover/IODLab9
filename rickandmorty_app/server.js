const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { healthCheck } = require('./config/api');
const characterRoutes = require('./routes/characters');
const favoriteRoutes = require('./routes/favorites');

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const apiHealth = await healthCheck();

    res.json({
      success: true,
      message: 'Rick and Morty API Explorer is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      thirdPartyAPI: {
        name: 'Rick and Morty API',
        url: 'https://rickandmortyapi.com',
        status: apiHealth.status,
        responseTime: apiHealth.responseTime
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/characters', characterRoutes);
app.use('/api/favorites', favoriteRoutes);

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Rick and Morty Character Explorer',
    version: '1.0.0',
    description: 'Express API with third-party Rick and Morty API integration',
    thirdPartyAPI: 'https://rickandmortyapi.com',
    endpoints: {
      health: '/api/health',
      characters: '/api/characters',
      favorites: '/api/favorites'
    },
    documentation: {
      characters: {
        'GET /api/characters': 'Get all characters (supports query parameters: page, name, status, species, type, gender)',
        'GET /api/characters/search': 'Search characters by name (query parameters: q, page, status, species, gender)',
        'GET /api/characters/random': 'Get a random character',
        'GET /api/characters/stats': 'Get character statistics',
        'GET /api/characters/:id': 'Get character by ID (path parameter)',
        'GET /api/characters/:id/episodes': 'Get character episodes (path parameter)',
        'GET /api/characters/:id/sheet': 'Get character sheet (path parameter)',
        'GET /api/characters/status/:status': 'Get characters by status (path parameter)',
        'GET /api/characters/species/:species': 'Get characters by species (path parameter)',
        'GET /api/characters/compare/:id1/:id2': 'Compare two characters (path parameters)',
        'POST /api/characters/multiple': 'Get multiple characters by IDs'
      },
      favorites: {
        'GET /api/favorites': 'Get all favorite characters',
        'GET /api/favorites/stats': 'Get favorites statistics',
        'GET /api/favorites/recent': 'Get recent favorites (query parameter: limit)',
        'GET /api/favorites/range': 'Get favorites by date range (query parameters: startDate, endDate)',
        'POST /api/favorites': 'Add character to favorites',
        'GET /api/favorites/:id': 'Get favorite by ID (path parameter)',
        'PUT /api/favorites/:id/notes': 'Update favorite notes (path parameter)',
        'GET /api/favorites/:id/sheet': 'Get character sheet for favorite (path parameter)',
        'DELETE /api/favorites/:id': 'Remove favorite by ID (path parameter)',
        'GET /api/favorites/check/:characterId': 'Check if character is favorited (path parameter)',
        'DELETE /api/favorites/character/:characterId': 'Remove favorite by character ID (path parameter)'
      }
    },
    examples: {
      queryParameters: [
        'GET /api/characters?page=2&status=alive',
        'GET /api/characters/search?q=rick&species=human',
        'GET /api/favorites/recent?limit=10',
        'GET /api/favorites/range?startDate=2024-01-01&endDate=2024-12-31'
      ],
      pathParameters: [
        'GET /api/characters/1',
        'GET /api/characters/status/alive',
        'GET /api/characters/species/human',
        'GET /api/characters/compare/1/2',
        'DELETE /api/favorites/character/5'
      ]
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/characters',
      '/api/favorites'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);

  let statusCode = error.status || 500;
  let message = error.message || 'Internal Server Error';

  // Handle specific error types
  if (error.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Rick and Morty API is unavailable';
  } else if (error.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'Network error - Cannot reach Rick and Morty API';
  } else if (error.code === 'ECONNABORTED') {
    statusCode = 504;
    message = 'Request timeout - Rick and Morty API is slow';
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
const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () => {
  console.log(`🚀 Rick and Morty API Explorer running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`🎭 Third-party API: Rick and Morty API`);
  console.log(`🔗 Characters: http://localhost:${PORT}/api/characters`);
  console.log(`❤️ Favorites: http://localhost:${PORT}/api/favorites`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;
