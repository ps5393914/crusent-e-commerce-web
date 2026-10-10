const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Offline';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_time TIMESTAMP;

      CREATE TABLE IF NOT EXISTS sellers (
        id VARCHAR(255) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(50),
        store_name VARCHAR(255) NOT NULL,
        business_address TEXT,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS seller_products (
        id VARCHAR(255) PRIMARY KEY,
        seller_id VARCHAR(255) REFERENCES sellers(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(255),
        price NUMERIC,
        image VARCHAR(255),
        specifications TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database connected and initialized.');
    client.release();
  } catch (err) {
    console.error('Error connecting to or initializing database:', err);
  }
};

module.exports = {
  pool,
  initDB
};
