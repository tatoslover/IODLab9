/**
 * Calculator Controller - Request Handling Layer
 *
 * This controller handles HTTP requests for calculator operations,
 * processes input parameters, calls the appropriate model methods,
 * and formats responses. It acts as the bridge between routes and
 * the business logic in the Calculator model.
 *
 * Features:
 * - Request validation and sanitization
 * - Error handling and appropriate HTTP status codes
 * - Consistent response formatting
 * - Support for both query parameters and request body
 * - Comprehensive logging
 * - History and statistics endpoints
 */

const Calculator = require('../models/Calculator');

class CalculatorController {
  constructor() {
    // Create a singleton calculator instance for this controller
    this.calculator = new Calculator();
  }

  /**
   * Private method to extract and validate numbers from request
   * @param {Object} req - Express request object
   * @returns {Object} Object containing num1 and num2
   * @throws {Error} If numbers are invalid
   */
  #extractNumbers(req) {
    // Try to get numbers from query parameters first, then body
    const { num1: queryNum1, num2: queryNum2 } = req.query;
    const { num1: bodyNum1, num2: bodyNum2 } = req.body || {};

    const num1 = queryNum1 || bodyNum1;
    const num2 = queryNum2 || bodyNum2;

    if (num1 === undefined || num2 === undefined) {
      throw new Error('Both num1 and num2 parameters are required');
    }

    try {
      const parsedNum1 = Calculator.parseNumber(num1);
      const parsedNum2 = Calculator.parseNumber(num2);

      return { num1: parsedNum1, num2: parsedNum2 };
    } catch (error) {
      throw new Error(`Invalid numbers provided: ${error.message}`);
    }
  }

  /**
   * Private method to extract single number from request
   * @param {Object} req - Express request object
   * @returns {number} Parsed number
   * @throws {Error} If number is invalid
   */
  #extractSingleNumber(req) {
    const { num: queryNum } = req.query;
    const { num: bodyNum } = req.body || {};

    const num = queryNum || bodyNum;

    if (num === undefined) {
      throw new Error('num parameter is required');
    }

    try {
      return Calculator.parseNumber(num);
    } catch (error) {
      throw new Error(`Invalid number provided: ${error.message}`);
    }
  }

  /**
   * Private method to format successful responses
   * @param {string} operation - Operation name
   * @param {number} num1 - First operand
   * @param {number} num2 - Second operand (optional)
   * @param {number} result - Operation result
   * @returns {Object} Formatted response object
   */
  #formatSuccessResponse(operation, num1, num2, result) {
    const response = {
      success: true,
      operation,
      result,
      timestamp: new Date().toISOString(),
      calculatorId: this.calculator.id
    };

    if (num2 !== undefined) {
      response.operands = { num1, num2 };
    } else {
      response.operand = num1;
    }

    return response;
  }

  /**
   * Private method to format error responses
   * @param {string} error - Error message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Formatted error response object
   */
  #formatErrorResponse(error, statusCode = 400) {
    return {
      success: false,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
      calculatorId: this.calculator.id
    };
  }

  /**
   * Addition endpoint handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  add(req, res) {
    try {
      const { num1, num2 } = this.#extractNumbers(req);
      const result = this.calculator.add(num1, num2);

      res.status(200).json(
        this.#formatSuccessResponse('addition', num1, num2, result)
      );
    } catch (error) {
      console.error('Addition error:', error.message);
      res.status(400).json(
        this.#formatErrorResponse(error.message)
      );
    }
  }

  /**
   * Subtraction endpoint handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  subtract(req, res) {
    try {
      const { num1, num2 } = this.#extractNumbers(req);
      const result = this.calculator.subtract(num1, num2);

      res.status(200).json(
        this.#formatSuccessResponse('subtraction', num1, num2, result)
      );
    } catch (error) {
      console.error('Subtraction error:', error.message);
      res.status(400).json(
        this.#formatErrorResponse(error.message)
      );
    }
  }

  /**
   * Multiplication endpoint handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  multiply(req, res) {
    try {
      const { num1, num2 } = this.#extractNumbers(req);
      const result = this.calculator.multiply(num1, num2);

      res.status(200).json(
        this.#formatSuccessResponse('multiplication', num1, num2, result)
      );
    } catch (error) {
      console.error('Multiplication error:', error.message);
      res.status(400).json(
        this.#formatErrorResponse(error.message)
      );
    }
  }

  /**
   * Division endpoint handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  divide(req, res) {
    try {
      const { num1, num2 } = this.#extractNumbers(req);
      const result = this.calculator.divide(num1, num2);

      res.status(200).json(
        this.#formatSuccessResponse('division', num1, num2, result)
      );
    } catch (error) {
      console.error('Division error:', error.message);
      res.status(400).json(
        this.#formatErrorResponse(error.message)
      );
    }
  }



  /**
   * Get calculation history
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;

      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      const history = this.calculator.getHistory(limit);

      res.status(200).json({
        success: true,
        history,
        count: history.length,
        calculatorId: this.calculator.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('History error:', error.message);
      res.status(400).json(
        this.#formatErrorResponse(error.message)
      );
    }
  }

  /**
   * Clear calculation history
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  clearHistory(req, res) {
    try {
      this.calculator.clearHistory();

      res.status(200).json({
        success: true,
        message: 'History cleared successfully',
        calculatorId: this.calculator.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Clear history error:', error.message);
      res.status(500).json(
        this.#formatErrorResponse(error.message, 500)
      );
    }
  }

  /**
   * Get calculator statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getStats(req, res) {
    try {
      const stats = this.calculator.getStats();

      res.status(200).json({
        success: true,
        stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Stats error:', error.message);
      res.status(500).json(
        this.#formatErrorResponse(error.message, 500)
      );
    }
  }

  /**
   * Health check endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  healthCheck(req, res) {
    res.status(200).json({
      success: true,
      status: 'healthy',
      service: 'Calculator API',
      calculatorId: this.calculator.id,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  }
}

// Export a singleton instance
module.exports = new CalculatorController();
