const bcrypt = require('bcryptjs');
const { pool, initDB } = require('./config/db');

const createAdmins = async () => {
  await initDB(); // Make sure the table and role column exist
  
  const admins = [
    { email: 'admin1@crusent.com', password: 'adminpassword1' },
    { email: 'admin2@crusent.com', password: 'adminpassword2' }
  ];

  try {
    for (const admin of admins) {
      // Check if admin already exists
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [admin.email]);
      
      if (res.rows.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);
        const id = Date.now().toString() + Math.floor(Math.random() * 1000);

        await pool.query(
          'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)',
          [id, admin.email, hashedPassword, 'admin']
        );
        console.log(`Successfully created admin: ${admin.email}`);
      } else {
        console.log(`Admin ${admin.email} already exists. Updating to ensure admin role...`);
        await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', admin.email]);
        console.log(`Admin ${admin.email} role updated.`);
      }
    }
  } catch (err) {
    console.error('Error creating admins:', err);
  } finally {
    pool.end();
  }
};

createAdmins();
