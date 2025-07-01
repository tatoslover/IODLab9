/**
 * Validation Middleware - Input Validation Layer
 *
 * This middleware module provides validation functions for calculator inputs.
 * It validates and sanitizes request parameters before they reach the controller,
 * ensuring data integrity and security.
 *
 * Features:
 * - Input validation for numbers
 * - Parameter existence checking
 * - Data type validation
 * - Range validation (optional)
 * - Error response formatting
 */

/**
 * Middleware to validate two numbers (num1 and num2)
 * Checks both query parameters and request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateTwoNumbers = (req, res, next) => {
  try {
    // Extract numbers from query or body
    const { num1: queryNum1, num2: queryNum2 } = req.query;
    const { num1: bodyNum1, num2: bodyNum2 } = req.body || {};

    const num1 = queryNum1 || bodyNum1;
    const num2 = queryNum2 || bodyNum2;

    // Check if both parameters exist
    if (num1 === undefined || num2 === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Both num1 and num2 parameters are required',
        details: {
          num1: num1 !== undefined ? 'provided' : 'missing',
          num2: num2 !== undefined ? 'provided' : 'missing'
        },
        examples: {
          query: '/calculator/add?num1=5&num2=3',
          body: 'POST with body: {"num1": 5, "num2": 3}'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Validate that inputs can be converted to numbers
    const parsedNum1 = parseFloat(num1);
    const parsedNum2 = parseFloat(num2);

    if (isNaN(parsedNum1)) {
      return res.status(400).json({
        success: false,
        error: 'num1 must be a valid number',
        provided: num1,
        type: typeof num1,
        timestamp: new Date().toISOString()
      });
    }

    if (isNaN(parsedNum2)) {
      return res.status(400).json({
        success: false,
        error: 'num2 must be a valid number',
        provided: num2,
        type: typeof num2,
        timestamp: new Date().toISOString()
      });
    }

    // Check for infinite values
    if (!isFinite(parsedNum1) || !isFinite(parsedNum2)) {
      return res.status(400).json({
        success: false,
        error: 'Infinite numbers are not supported',
        num1: { value: parsedNum1, isFinite: isFinite(parsedNum1) },
        num2: { value: parsedNum2, isFinite: isFinite(parsedNum2) },
        timestamp: new Date().toISOString()
      });
    }

    // Optional: Check for reasonable number ranges
    const MAX_SAFE_NUMBER = Number.MAX_SAFE_INTEGER;
    const MIN_SAFE_NUMBER = Number.MIN_SAFE_INTEGER;

    if (parsedNum1 > MAX_SAFE_NUMBER || parsedNum1 < MIN_SAFE_NUMBER) {
      return res.status(400).json({
        success: false,
        error: 'num1 is outside safe number range',
        provided: parsedNum1,
        range: { min: MIN_SAFE_NUMBER, max: MAX_SAFE_NUMBER },
        timestamp: new Date().toISOString()
      });
    }

    if (parsedNum2 > MAX_SAFE_NUMBER || parsedNum2 < MIN_SAFE_NUMBER) {
      return res.status(400).json({
        success: false,
        error: 'num2 is outside safe number range',
        provided: parsedNum2,
        range: { min: MIN_SAFE_NUMBER, max: MAX_SAFE_NUMBER },
        timestamp: new Date().toISOString()
      });
    }

    // Store validated numbers in request for controller use
    req.validatedNumbers = {
      num1: parsedNum1,
      num2: parsedNum2
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal validation error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};



/**
 * Middleware to validate pagination parameters
 * Used for history endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validatePagination = (req, res, next) => {
  try {
    const { limit, offset } = req.query;

    // Validate limit parameter
    if (limit !== undefined) {
      const parsedLimit = parseInt(limit);

      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return res.status(400).json({
          success: false,
          error: 'limit must be a number between 1 and 100',
          provided: limit,
          range: { min: 1, max: 100 },
          timestamp: new Date().toISOString()
        });
      }

      req.validatedPagination = { limit: parsedLimit };
    }

    // Validate offset parameter
    if (offset !== undefined) {
      const parsedOffset = parseInt(offset);

      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({
          success: false,
          error: 'offset must be a non-negative number',
          provided: offset,
          timestamp: new Date().toISOString()
        });
      }

      req.validatedPagination = {
        ...req.validatedPagination,
        offset: parsedOffset
      };
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal validation error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Custom validation for specific operations
 */
const customValidations = {
  /**
   * Validation specific to division operation
   * Adds check for division by zero at middleware level
   */
  division: (req, res, next) => {
    const { num2: queryNum2 } = req.query;
    const { num2: bodyNum2 } = req.body || {};
    const num2 = parseFloat(queryNum2 || bodyNum2);

    if (num2 === 0) {
      return res.status(400).json({
        success: false,
        error: 'Division by zero is not allowed',
        num2: num2,
        timestamp: new Date().toISOString()
      });
    }

    next();
  },


};

module.exports = {
  validateTwoNumbers,
  validatePagination,
  customValidations
};
