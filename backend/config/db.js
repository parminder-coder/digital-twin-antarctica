import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL 8.4 Connection Pool Configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'antarctic_station_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Database connectivity check wrapper
export const checkDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(' Successfully connected to MySQL 8.4 database: antarctic_station_db');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️  MySQL Database connection failed (using dynamic memory query fallback):', error.message);
    return false;
  }
};

export default pool;
