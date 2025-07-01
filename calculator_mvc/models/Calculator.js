/**
 * Calculator Model - Business Logic Layer
 *
 * This model handles all mathematical operations and business rules
 * for the calculator application. It encapsulates the core functionality
 * and provides a clean interface for the controller layer.
 *
 * Features:
 * - Basic arithmetic operations (add, subtract, multiply, divide)
 * - Input validation and error handling
 * - Operation history tracking
 * - Precision handling for floating-point operations
 * - Comprehensive logging
 */

class Calculator {
  constructor() {
    this.id = Date.now();
    this.history = [];
    this.maxHistorySize = 100;
    this.precision = 10; // Decimal places for rounding
  }

  /**
   * Private method to log operations
   * @param {string} operation - Operation symbol
   * @param {number} num1 - First operand
   * @param {number} num2 - Second operand
   * @param {number} result - Operation result
   */
  #log(operation, num1, num2, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      operation,
      num1,
      num2,
      result,
      calculatorId: this.id
    };

    console.log(`[Calculator: ${this.id}]: ${num1} ${operation} ${num2} = ${result}`);
    this.#addToHistory(logEntry);
  }

  /**
   * Private method to add operation to history
   * @param {Object} logEntry - Operation log entry
   */
  #addToHistory(logEntry) {
    this.history.push(logEntry);

    // Keep history size manageable
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Private method to validate inputs
   * @param {any} num1 - First number to validate
   * @param {any} num2 - Second number to validate
   * @throws {Error} If inputs are invalid
   */
  #validateInputs(num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Both operands must be numbers');
    }

    if (isNaN(num1) || isNaN(num2)) {
      throw new Error('Invalid number provided (NaN)');
    }

    if (!isFinite(num1) || !isFinite(num2)) {
      throw new Error('Infinite numbers are not supported');
    }
  }

  /**
   * Private method to round result to avoid floating-point precision issues
   * @param {number} result - Number to round
   * @returns {number} Rounded result
   */
  #roundResult(result) {
    return Math.round((result + Number.EPSILON) * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
  }

  /**
   * Addition operation
   * @param {number} num1 - First number
   * @param {number} num2 - Second number
   * @returns {number} Sum of num1 and num2
   * @throws {Error} If inputs are invalid
   */
  add(num1, num2) {
    this.#validateInputs(num1, num2);

    const result = this.#roundResult(num1 + num2);
    this.#log('+', num1, num2, result);

    return result;
  }

  /**
   * Subtraction operation
   * @param {number} num1 - Minuend
   * @param {number} num2 - Subtrahend
   * @returns {number} Difference of num1 and num2
   * @throws {Error} If inputs are invalid
   */
  subtract(num1, num2) {
    this.#validateInputs(num1, num2);

    const result = this.#roundResult(num1 - num2);
    this.#log('-', num1, num2, result);

    return result;
  }

  /**
   * Multiplication operation
   * @param {number} num1 - First factor
   * @param {number} num2 - Second factor
   * @returns {number} Product of num1 and num2
   * @throws {Error} If inputs are invalid
   */
  multiply(num1, num2) {
    this.#validateInputs(num1, num2);

    const result = this.#roundResult(num1 * num2);
    this.#log('*', num1, num2, result);

    return result;
  }

  /**
   * Division operation
   * @param {number} num1 - Dividend
   * @param {number} num2 - Divisor
   * @returns {number} Quotient of num1 and num2
   * @throws {Error} If inputs are invalid or division by zero
   */
  divide(num1, num2) {
    this.#validateInputs(num1, num2);

    if (num2 === 0) {
      throw new Error('Division by zero is not allowed');
    }

    const result = this.#roundResult(num1 / num2);
    this.#log('/', num1, num2, result);

    return result;
  }



  /**
   * Get calculation history
   * @param {number} limit - Maximum number of history entries to return
   * @returns {Array} Array of calculation history entries
   */
  getHistory(limit = 10) {
    return this.history.slice(-limit).reverse(); // Most recent first
  }

  /**
   * Clear calculation history
   */
  clearHistory() {
    this.history = [];
    console.log(`[Calculator: ${this.id}]: History cleared`);
  }

  /**
   * Get calculator statistics
   * @returns {Object} Statistics about calculator usage
   */
  getStats() {
    const operationCounts = {};

    this.history.forEach(entry => {
      operationCounts[entry.operation] = (operationCounts[entry.operation] || 0) + 1;
    });

    return {
      calculatorId: this.id,
      totalOperations: this.history.length,
      operationCounts,
      firstOperation: this.history[0]?.timestamp || null,
      lastOperation: this.history[this.history.length - 1]?.timestamp || null
    };
  }

  /**
   * Validate and parse input numbers from strings
   * @param {string|number} input - Input to parse
   * @returns {number} Parsed number
   * @throws {Error} If input cannot be parsed to valid number
   */
  static parseNumber(input) {
    if (typeof input === 'number') {
      return input;
    }

    if (typeof input === 'string') {
      const parsed = parseFloat(input.trim());

      if (isNaN(parsed)) {
        throw new Error(`Cannot parse "${input}" as a number`);
      }

      return parsed;
    }

    throw new Error('Input must be a number or string representation of a number');
  }

  /**
   * Create a new calculator instance
   * @returns {Calculator} New calculator instance
   */
  static create() {
    return new Calculator();
  }
}

module.exports = Calculator;
