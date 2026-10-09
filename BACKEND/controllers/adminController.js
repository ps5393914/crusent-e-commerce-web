const { pool } = require('../config/db');

const getDashboardData = async (req, res) => {
  try {
    const usersRes = await pool.query('SELECT id, email, role, status, last_login_time FROM users ORDER BY last_login_time DESC NULLS LAST');
    
    res.status(200).json({
      customers: [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', registeredAt: '2023-10-01' },
        { id: 2, name: 'Bob Jones', email: 'bob@example.com', registeredAt: '2023-10-05' }
      ],
      orders: [
        { id: 101, customer: 'Alice Smith', total: 499, status: 'Shipped' },
        { id: 102, customer: 'Bob Jones', total: 1299, status: 'Pending' }
      ],
      bookings: [
        { id: 201, service: 'Installation', date: '2023-10-15', status: 'Confirmed' }
      ],
      stats: {
        totalUsers: usersRes.rowCount,
        totalSales: 15420,
        activeSessions: usersRes.rows.filter(u => u.status === 'Online').length
      },
      users: usersRes.rows
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardData
};
