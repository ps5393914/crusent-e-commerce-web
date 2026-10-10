const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerSeller, loginSeller, addProduct, getMyProducts, updateProduct, deleteProduct, getProfile } = require('../controllers/sellerController');

const router = express.Router();

const sellerProtect = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a seller' });
  }
};

// Auth
router.post('/auth/register', registerSeller);
router.post('/auth/login', loginSeller);

// Profile
router.get('/profile', protect, sellerProtect, getProfile);

// Products
router.route('/products')
  .post(protect, sellerProtect, addProduct)
  .get(protect, sellerProtect, getMyProducts);
  
router.route('/products/:id')
  .put(protect, sellerProtect, updateProduct)
  .delete(protect, sellerProtect, deleteProduct);

module.exports = router;
