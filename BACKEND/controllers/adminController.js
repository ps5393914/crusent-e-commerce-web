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

const getSellers = async (req, res) => {
  try {
    const sellersRes = await pool.query('SELECT id, full_name, email, phone_number, store_name, business_address, status, created_at FROM sellers ORDER BY created_at DESC');
    res.status(200).json(sellersRes.rows);
  } catch (err) {
    console.error('Error fetching sellers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSellerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['approved', 'rejected', 'suspended'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    await pool.query('UPDATE sellers SET status = $1 WHERE id = $2', [status, id]);
    res.status(200).json({ message: `Seller account ${status} successfully` });
  } catch (err) {
    console.error('Error updating seller status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const productsRes = await pool.query(`
      SELECT sp.*, s.store_name 
      FROM seller_products sp 
      JOIN sellers s ON sp.seller_id = s.id 
      ORDER BY sp.created_at DESC
    `);
    res.status(200).json(productsRes.rows);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    await pool.query('UPDATE seller_products SET status = $1 WHERE id = $2', [status, id]);
    res.status(200).json({ message: `Product ${status} successfully` });
  } catch (err) {
    console.error('Error updating product status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardData,
  getSellers,
  updateSellerStatus,
  getSellerProducts,
  updateProductStatus
};
