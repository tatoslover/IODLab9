/**
 * Enhanced Calculator MVC - Demo Script
 *
 * This script demonstrates the calculator functionality by testing
 * various operations and features of the Calculator model.
 */

const Calculator = require('./models/Calculator');

// Demo colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function separator(title) {
  log('\n' + '='.repeat(50), 'cyan');
  log(` ${title}`, 'bright');
  log('='.repeat(50), 'cyan');
}

async function runDemo() {
  try {
    separator('ENHANCED CALCULATOR MVC - DEMO');

    // Create calculator instance
    const calculator = Calculator.create();
    log(`✅ Calculator created with ID: ${calculator.id}`, 'green');

    separator('BASIC ARITHMETIC OPERATIONS');

    // Test basic operations
    const operations = [
      { op: 'add', num1: 15, num2: 25, expected: 40 },
      { op: 'subtract', num1: 100, num2: 35, expected: 65 },
      { op: 'multiply', num1: 12, num2: 8, expected: 96 },
      { op: 'divide', num1: 144, num2: 12, expected: 12 }
    ];

    operations.forEach(({ op, num1, num2, expected }) => {
      try {
        const result = calculator[op](num1, num2);
        const symbol = {
          add: '+',
          subtract: '-',
          multiply: '×',
          divide: '÷'
        }[op];

        if (result === expected) {
          log(`✅ ${num1} ${symbol} ${num2} = ${result}`, 'green');
        } else {
          log(`❌ ${num1} ${symbol} ${num2} = ${result} (expected ${expected})`, 'red');
        }
      } catch (error) {
        log(`❌ Error in ${op}: ${error.message}`, 'red');
      }
    });

    separator('ADVANCED OPERATIONS');

    // Test advanced operations
    try {
      const powerResult = calculator.power(2, 8);
      log(`✅ 2^8 = ${powerResult}`, 'green');

      const sqrtResult = calculator.sqrt(64);
      log(`✅ √64 = ${sqrtResult}`, 'green');

      const largePower = calculator.power(3, 4);
      log(`✅ 3^4 = ${largePower}`, 'green');

      const decimalSqrt = calculator.sqrt(2);
      log(`✅ √2 = ${decimalSqrt}`, 'green');
    } catch (error) {
      log(`❌ Error in advanced operations: ${error.message}`, 'red');
    }

    separator('FLOATING POINT PRECISION');

    // Test floating point operations
    try {
      const float1 = calculator.add(0.1, 0.2);
      log(`✅ 0.1 + 0.2 = ${float1} (precision handling)`, 'green');

      const float2 = calculator.multiply(0.3, 3);
      log(`✅ 0.3 × 3 = ${float2}`, 'green');

      const float3 = calculator.divide(1, 3);
      log(`✅ 1 ÷ 3 = ${float3} (rounded to 10 decimal places)`, 'green');
    } catch (error) {
      log(`❌ Error in floating point operations: ${error.message}`, 'red');
    }

    separator('ERROR HANDLING');

    // Test error conditions
    const errorTests = [
      {
        name: 'Division by zero',
        test: () => calculator.divide(10, 0),
        expectedError: 'Division by zero is not allowed'
      },
      {
        name: 'Negative square root',
        test: () => calculator.sqrt(-16),
        expectedError: 'Cannot calculate square root of negative number'
      },
      {
        name: 'Invalid input types',
        test: () => calculator.add('hello', 5),
        expectedError: 'Both operands must be numbers'
      },
      {
        name: 'NaN input',
        test: () => calculator.multiply(NaN, 5),
        expectedError: 'Invalid number provided (NaN)'
      }
    ];

    errorTests.forEach(({ name, test, expectedError }) => {
      try {
        test();
        log(`❌ ${name}: Should have thrown error`, 'red');
      } catch (error) {
        if (error.message.includes(expectedError) || error.message === expectedError) {
          log(`✅ ${name}: Correctly caught error - ${error.message}`, 'green');
        } else {
          log(`⚠️  ${name}: Unexpected error - ${error.message}`, 'yellow');
        }
      }
    });

    separator('HISTORY TRACKING');

    // Test history functionality
    const history = calculator.getHistory();
    log(`📋 Current history contains ${history.length} operations`, 'blue');

    if (history.length > 0) {
      log('\nRecent operations:', 'blue');
      history.slice(0, 5).forEach((entry, index) => {
        const timestamp = new Date(entry.timestamp).toLocaleTimeString();
        if (entry.num2 !== undefined) {
          log(`  ${index + 1}. ${entry.num1} ${entry.operation} ${entry.num2} = ${entry.result} (${timestamp})`, 'cyan');
        } else {
          log(`  ${index + 1}. ${entry.operation} ${entry.num1} = ${entry.result} (${timestamp})`, 'cyan');
        }
      });
    }

    separator('STATISTICS');

    // Test statistics
    const stats = calculator.getStats();
    log(`📊 Calculator Statistics:`, 'blue');
    log(`   • Total Operations: ${stats.totalOperations}`, 'cyan');
    log(`   • Calculator ID: ${stats.calculatorId}`, 'cyan');

    if (stats.operationCounts && Object.keys(stats.operationCounts).length > 0) {
      log(`   • Operation Breakdown:`, 'cyan');
      Object.entries(stats.operationCounts).forEach(([op, count]) => {
        log(`     - ${op}: ${count} times`, 'cyan');
      });
    }

    if (stats.firstOperation) {
      log(`   • First Operation: ${new Date(stats.firstOperation).toLocaleString()}`, 'cyan');
    }

    if (stats.lastOperation) {
      log(`   • Last Operation: ${new Date(stats.lastOperation).toLocaleString()}`, 'cyan');
    }

    separator('INPUT PARSING TESTS');

    // Test static parsing methods
    const parseTests = [
      { input: '42', expected: 42 },
      { input: '3.14159', expected: 3.14159 },
      { input: '-15', expected: -15 },
      { input: '  100  ', expected: 100 },
      { input: 25, expected: 25 }
    ];

    parseTests.forEach(({ input, expected }) => {
      try {
        const result = Calculator.parseNumber(input);
        if (result === expected) {
          log(`✅ parseNumber(${JSON.stringify(input)}) = ${result}`, 'green');
        } else {
          log(`❌ parseNumber(${JSON.stringify(input)}) = ${result} (expected ${expected})`, 'red');
        }
      } catch (error) {
        log(`❌ parseNumber(${JSON.stringify(input)}) threw error: ${error.message}`, 'red');
      }
    });

    separator('COMPLEX CALCULATIONS');

    // Perform some complex calculations
    try {
      // Calculate compound interest formula: A = P(1 + r/n)^(nt)
      // Where P=1000, r=0.05, n=12, t=2
      const principal = 1000;
      const rate = 0.05;
      const periods = 12;
      const time = 2;

      const ratePerPeriod = calculator.divide(rate, periods);
      const onePlusRate = calculator.add(1, ratePerPeriod);
      const exponent = calculator.multiply(periods, time);
      const compound = calculator.power(onePlusRate, exponent);
      const amount = calculator.multiply(principal, compound);

      log(`💰 Compound Interest Calculation:`, 'blue');
      log(`   Principal: $${principal}`, 'cyan');
      log(`   Annual Rate: ${rate * 100}%`, 'cyan');
      log(`   Compounded Monthly for ${time} years`, 'cyan');
      log(`   Final Amount: $${amount.toFixed(2)}`, 'green');

      // Calculate area of circle: A = πr²
      const radius = 7;
      const pi = 3.14159265359;
      const radiusSquared = calculator.power(radius, 2);
      const area = calculator.multiply(pi, radiusSquared);

      log(`\n🔵 Circle Area Calculation:`, 'blue');
      log(`   Radius: ${radius}`, 'cyan');
      log(`   Area: ${area.toFixed(2)} square units`, 'green');

    } catch (error) {
      log(`❌ Error in complex calculations: ${error.message}`, 'red');
    }

    separator('PERFORMANCE TEST');

    // Performance test
    const startTime = Date.now();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      calculator.add(i, i + 1);
      calculator.multiply(i, 2);
      if (i > 0) {
        calculator.divide(i * 2, i);
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    log(`⚡ Performance Test Results:`, 'blue');
    log(`   Operations: ${iterations * 3} calculations`, 'cyan');
    log(`   Duration: ${duration}ms`, 'cyan');
    log(`   Rate: ${Math.round((iterations * 3) / (duration / 1000))} operations/second`, 'green');

    separator('DEMO COMPLETE');

    const finalStats = calculator.getStats();
    log(`🎉 Demo completed successfully!`, 'green');
    log(`📊 Final Statistics:`, 'blue');
    log(`   • Total Operations Performed: ${finalStats.totalOperations}`, 'cyan');
    log(`   • Calculator Instance ID: ${finalStats.calculatorId}`, 'cyan');
    log(`   • Demo Duration: ${Date.now() - startTime}ms`, 'cyan');

    // Clean up for next demo
    log(`\n🧹 Clearing history for next demo...`, 'yellow');
    calculator.clearHistory();
    log(`✅ History cleared`, 'green');

  } catch (error) {
    log(`💥 Fatal error in demo: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  log('🚀 Starting Enhanced Calculator MVC Demo...', 'bright');
  runDemo().then(() => {
    log('\n👋 Demo finished. Thank you!', 'bright');
  }).catch((error) => {
    log(`\n💥 Demo failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runDemo };
