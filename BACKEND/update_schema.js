const { pool } = require('./config/db');

async function updateSchema() {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Offline',
      ADD COLUMN IF NOT EXISTS last_login_time TIMESTAMP;
    `);
    
    // Set default status to 'Offline' for all existing rows just in case
    await pool.query(`UPDATE users SET status = 'Offline' WHERE status IS NULL`);
    
    console.log('Successfully updated users table schema.');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    pool.end();
  }
}

updateSchema();
