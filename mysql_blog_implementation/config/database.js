const mysql = require('mysql2/promise');

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blogging_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
let pool;

const createPool = () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ MySQL connection pool created successfully');
    return pool;
  } catch (error) {
    console.error('❌ Error creating MySQL connection pool:', error.message);
    throw error;
  }
};

// Get database connection from pool
const getConnection = async () => {
  try {
    if (!pool) {
      createPool();
    }
    return await pool.getConnection();
  } catch (error) {
    console.error('❌ Error getting database connection:', error.message);
    throw error;
  }
};

// Execute query with automatic connection handling
const executeQuery = async (query, params = []) => {
  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Execute transaction
const executeTransaction = async (queries) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();

    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params || []);
      results.push(result);
    }

    await connection.commit();
    return results;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('❌ Transaction error:', error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await getConnection();
    console.log('✅ Database connection test successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

// Initialize database connection
const connectDB = async () => {
  try {
    createPool();
    await testConnection();
    console.log(`✅ Connected to MySQL database: ${dbConfig.database}`);
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error.message);
    process.exit(1);
  }
};

// Gracefully close database connections
const closeDB = async () => {
  try {
    if (pool) {
      await pool.end();
      console.log('✅ MySQL connection pool closed');
    }
  } catch (error) {
    console.error('❌ Error closing database connections:', error.message);
  }
};

module.exports = {
  connectDB,
  closeDB,
  executeQuery,
  executeTransaction,
  getConnection,
  pool: () => pool
};
