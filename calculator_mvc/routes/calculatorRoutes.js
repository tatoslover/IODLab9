/**
 * Calculator Routes - URL Routing Layer
 *
 * This module defines all the routes for calculator operations.
 * It follows RESTful principles and provides clean, intuitive endpoints
 * for mathematical operations and calculator management.
 *
 * Routes:
 * - Basic Operations: GET /add, /subtract, /multiply, /divide
 * - History Management: GET /history, DELETE /history
 * - Statistics: GET /stats
 * - Health Check: GET /health
 */

const express = require('express');
const calculatorController = require('../controllers/CalculatorController');
const validationMiddleware = require('../middleware/validation');
const router = express.Router();

// Basic arithmetic operations
// GET /calculator/add?num1=5&num2=3
router.get('/add',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.add(req, res)
);

// GET /calculator/subtract?num1=10&num2=4
router.get('/subtract',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.subtract(req, res)
);

// GET /calculator/multiply?num1=6&num2=7
router.get('/multiply',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.multiply(req, res)
);

// GET /calculator/divide?num1=20&num2=4
router.get('/divide',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.divide(req, res)
);



// POST endpoints for operations (alternative to GET with query params)
router.post('/add',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.add(req, res)
);

router.post('/subtract',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.subtract(req, res)
);

router.post('/multiply',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.multiply(req, res)
);

router.post('/divide',
  validationMiddleware.validateTwoNumbers,
  (req, res) => calculatorController.divide(req, res)
);



// History and statistics endpoints
// GET /calculator/history?limit=20
router.get('/history', (req, res) => calculatorController.getHistory(req, res));

// DELETE /calculator/history
router.delete('/history', (req, res) => calculatorController.clearHistory(req, res));

// GET /calculator/stats
router.get('/stats', (req, res) => calculatorController.getStats(req, res));

// Health check endpoint
// GET /calculator/health
router.get('/health', (req, res) => calculatorController.healthCheck(req, res));

// Route documentation endpoint
router.get('/', (req, res) => {
  res.json({
    service: 'Simple Calculator API',
    version: '2.0.0',
    description: 'RESTful calculator API with MVC architecture - Basic Operations Only',
    endpoints: {
      'Basic Operations': {
        'GET /calculator/add?num1=X&num2=Y': 'Addition',
        'GET /calculator/subtract?num1=X&num2=Y': 'Subtraction',
        'GET /calculator/multiply?num1=X&num2=Y': 'Multiplication',
        'GET /calculator/divide?num1=X&num2=Y': 'Division'
      },
      'POST Operations': {
        'POST /calculator/add': 'Addition (body: {num1, num2})',
        'POST /calculator/subtract': 'Subtraction (body: {num1, num2})',
        'POST /calculator/multiply': 'Multiplication (body: {num1, num2})',
        'POST /calculator/divide': 'Division (body: {num1, num2})'
      },
      'Management': {
        'GET /calculator/history?limit=N': 'Get calculation history',
        'DELETE /calculator/history': 'Clear calculation history',
        'GET /calculator/stats': 'Get calculator statistics',
        'GET /calculator/health': 'Health check'
      }
    },
    examples: {
      addition: 'GET /calculator/add?num1=5&num2=3',
      subtraction: 'GET /calculator/subtract?num1=10&num2=4',
      multiplication: 'GET /calculator/multiply?num1=6&num2=7',
      division: 'GET /calculator/divide?num1=20&num2=4',
      history: 'GET /calculator/history?limit=10'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
