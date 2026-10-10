const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const registerSeller = async (req, res) => {
  const { fullName, email, phoneNumber, storeName, businessAddress, password, confirmPassword } = req.body;

  if (!fullName || !email || !storeName || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingSeller = await pool.query('SELECT * FROM sellers WHERE email = $1', [email]);
    if (existingSeller.rows.length > 0) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = 'seller_' + Date.now().toString();

    await pool.query(
      'INSERT INTO sellers (id, full_name, email, phone_number, store_name, business_address, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, fullName, email, phoneNumber, storeName, businessAddress, hashedPassword]
    );

    res.status(201).json({ message: 'Seller registered successfully. Pending admin approval.' });
  } catch (err) {
    console.error('Error registering seller:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginSeller = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const sellerRes = await pool.query('SELECT * FROM sellers WHERE email = $1', [email]);
    if (sellerRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const seller = sellerRes.rows[0];

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (seller.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    }
    if (seller.status === 'rejected' || seller.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been ' + seller.status });
    }

    const token = jwt.sign({ id: seller.id, email: seller.email, role: 'seller' }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '1d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Logged in successfully',
      user: { id: seller.id, email: seller.email, role: 'seller', storeName: seller.store_name, name: seller.full_name }
    });
  } catch (err) {
    console.error('Error during seller login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addProduct = async (req, res) => {
  const { name, description, category, price, image, specifications } = req.body;
  const sellerId = req.user.id;

  try {
    const id = 'prod_' + Date.now().toString();
    await pool.query(
      'INSERT INTO seller_products (id, seller_id, name, description, category, price, image, specifications) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, sellerId, name, description, category, price, image || '/images/default_product.jpg', specifications]
    );

    res.status(201).json({ message: 'Product added successfully. Pending admin approval.' });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyProducts = async (req, res) => {
  const sellerId = req.user.id;

  try {
    const productsRes = await pool.query('SELECT * FROM seller_products WHERE seller_id = $1 ORDER BY created_at DESC', [sellerId]);
    res.status(200).json(productsRes.rows);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, image, specifications } = req.body;
  const sellerId = req.user.id;

  try {
    const productRes = await pool.query('SELECT * FROM seller_products WHERE id = $1 AND seller_id = $2', [id, sellerId]);
    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await pool.query(
      'UPDATE seller_products SET name=$1, description=$2, category=$3, price=$4, image=$5, specifications=$6, status=$7 WHERE id=$8 AND seller_id=$9',
      [name, description, category, price, image || '/images/default_product.jpg', specifications, 'pending', id, sellerId]
    );

    res.status(200).json({ message: 'Product updated successfully. Pending admin approval.' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id;

  try {
    const productRes = await pool.query('SELECT * FROM seller_products WHERE id = $1 AND seller_id = $2', [id, sellerId]);
    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await pool.query('DELETE FROM seller_products WHERE id=$1 AND seller_id=$2', [id, sellerId]);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const sellerRes = await pool.query('SELECT id, full_name, email, phone_number, store_name, business_address, status, created_at FROM sellers WHERE id = $1', [req.user.id]);
    if (sellerRes.rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(sellerRes.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  addProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getProfile
};
