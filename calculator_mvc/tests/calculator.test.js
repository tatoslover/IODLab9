/**
 * Calculator Application Tests
 *
 * Basic test suite for the simple calculator MVC application.
 * Tests both the Calculator model and API endpoints.
 */

const request = require('supertest');
const Calculator = require('../models/Calculator');
const app = require('../app');

describe('Calculator Model Tests', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Basic Operations', () => {
    test('should add two numbers correctly', () => {
      const result = calculator.add(5, 3);
      expect(result).toBe(8);
    });

    test('should subtract two numbers correctly', () => {
      const result = calculator.subtract(10, 4);
      expect(result).toBe(6);
    });

    test('should multiply two numbers correctly', () => {
      const result = calculator.multiply(6, 7);
      expect(result).toBe(42);
    });

    test('should divide two numbers correctly', () => {
      const result = calculator.divide(20, 4);
      expect(result).toBe(5);
    });

    test('should throw error for division by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Division by zero is not allowed');
    });
  });



  describe('Input Validation', () => {
    test('should handle floating point numbers', () => {
      const result = calculator.add(1.1, 2.2);
      expect(result).toBeCloseTo(3.3);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => calculator.add('invalid', 5)).toThrow('Both operands must be numbers');
      expect(() => calculator.add(5, NaN)).toThrow('Invalid number provided (NaN)');
    });

    test('should handle large numbers', () => {
      const result = calculator.multiply(1000000, 1000000);
      expect(result).toBe(1000000000000);
    });
  });

  describe('History Tracking', () => {
    test('should track operation history', () => {
      calculator.add(5, 3);
      calculator.multiply(2, 4);

      const history = calculator.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].operation).toBe('*');
      expect(history[1].operation).toBe('+');
    });

    test('should clear history', () => {
      calculator.add(1, 2);
      calculator.clearHistory();

      const history = calculator.getHistory();
      expect(history).toHaveLength(0);
    });

    test('should provide statistics', () => {
      calculator.add(1, 2);
      calculator.add(3, 4);
      calculator.multiply(2, 3);

      const stats = calculator.getStats();
      expect(stats.totalOperations).toBe(3);
      expect(stats.operationCounts['+']).toBe(2);
      expect(stats.operationCounts['*']).toBe(1);
    });
  });
});

describe('Calculator API Tests', () => {
  describe('GET /calculator endpoints', () => {
    test('GET /calculator/add should return correct result', async () => {
      const response = await request(app)
        .get('/calculator/add?num1=5&num2=3')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe(8);
      expect(response.body.operation).toBe('addition');
    });

    test('GET /calculator/subtract should return correct result', async () => {
      const response = await request(app)
        .get('/calculator/subtract?num1=10&num2=4')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe(6);
      expect(response.body.operation).toBe('subtraction');
    });

    test('GET /calculator/multiply should return correct result', async () => {
      const response = await request(app)
        .get('/calculator/multiply?num1=6&num2=7')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe(42);
      expect(response.body.operation).toBe('multiplication');
    });

    test('GET /calculator/divide should return correct result', async () => {
      const response = await request(app)
        .get('/calculator/divide?num1=20&num2=4')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe(5);
      expect(response.body.operation).toBe('division');
    });


  });

  describe('POST /calculator endpoints', () => {
    test('POST /calculator/add should return correct result', async () => {
      const response = await request(app)
        .post('/calculator/add')
        .send({ num1: 5, num2: 3 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe(8);
      expect(response.body.operation).toBe('addition');
    });

    test('POST /calculator/multiply should return correct result', async () => {
      const response = await request(app)
        .post('/calculator/multiply')
        .send({ num1: 6, num2: 7 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe(42);
      expect(response.body.operation).toBe('multiplication');
    });
  });

  describe('Error Handling', () => {
    test('should return 400 for missing parameters', async () => {
      const response = await request(app)
        .get('/calculator/add?num1=5')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Both num1 and num2 parameters are required');
    });

    test('should return 400 for invalid numbers', async () => {
      const response = await request(app)
        .get('/calculator/add?num1=invalid&num2=5')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('num1 must be a valid number');
    });

    test('should return 400 for division by zero', async () => {
      const response = await request(app)
        .get('/calculator/divide?num1=10&num2=0')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Division by zero is not allowed');
    });


  });

  describe('Management Endpoints', () => {
    test('GET /calculator/history should return history', async () => {
      // Perform some operations first
      await request(app).get('/calculator/add?num1=1&num2=2');
      await request(app).get('/calculator/multiply?num1=3&num2=4');

      const response = await request(app)
        .get('/calculator/history?limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.history)).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(0);
    });

    test('DELETE /calculator/history should clear history', async () => {
      const response = await request(app)
        .delete('/calculator/history')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('History cleared successfully');
    });

    test('GET /calculator/stats should return statistics', async () => {
      const response = await request(app)
        .get('/calculator/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
      expect(typeof response.body.stats.totalOperations).toBe('number');
    });

    test('GET /calculator/health should return health status', async () => {
      const response = await request(app)
        .get('/calculator/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('Calculator API');
    });
  });

  describe('Root Endpoints', () => {
    test('GET / should serve calculator HTML', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.type).toBe('text/html');
      expect(response.text).toContain('Simple Calculator');
    });

    test('GET /api should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.service).toBe('Simple Calculator API');
      expect(response.body.version).toBe('2.0.0');
      expect(response.body.endpoints).toBeDefined();
    });

    test('GET /health should return system health', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
      expect(response.body.memory).toBeDefined();
    });
  });

  describe('Error Routes', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Route not found');
      expect(response.body.suggestions).toBeDefined();
    });
  });
});

describe('Static Number Utilities', () => {
  describe('Calculator.parseNumber', () => {
    test('should parse valid number strings', () => {
      expect(Calculator.parseNumber('5')).toBe(5);
      expect(Calculator.parseNumber('3.14')).toBe(3.14);
      expect(Calculator.parseNumber('-10')).toBe(-10);
      expect(Calculator.parseNumber('  42  ')).toBe(42);
    });

    test('should return numbers as-is', () => {
      expect(Calculator.parseNumber(5)).toBe(5);
      expect(Calculator.parseNumber(3.14)).toBe(3.14);
      expect(Calculator.parseNumber(-10)).toBe(-10);
    });

    test('should throw errors for invalid inputs', () => {
      expect(() => Calculator.parseNumber('invalid')).toThrow('Cannot parse "invalid" as a number');
      expect(() => Calculator.parseNumber('')).toThrow('Cannot parse "" as a number');
      expect(() => Calculator.parseNumber(null)).toThrow('Input must be a number or string representation of a number');
      expect(() => Calculator.parseNumber(undefined)).toThrow('Input must be a number or string representation of a number');
    });
  });

  describe('Calculator.create', () => {
    test('should create new calculator instance', () => {
      const calc = Calculator.create();
      expect(calc).toBeInstanceOf(Calculator);
      expect(calc.id).toBeDefined();
    });
  });
});
