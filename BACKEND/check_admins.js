const { pool } = require('./config/db');

async function checkAdmins() {
  try {
    const res = await pool.query('SELECT id, email, role, password FROM users WHERE email IN ($1, $2)', ['admin1@crusent.com', 'admin2@crusent.com']);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error fetching admins:', err);
  } finally {
    pool.end();
  }
}

checkAdmins();
