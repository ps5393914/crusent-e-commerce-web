const express = require('express');
const { protect, adminProtect } = require('../middleware/authMiddleware');
const { getDashboardData, getSellers, updateSellerStatus, getSellerProducts, updateProductStatus } = require('../controllers/adminController');

const router = express.Router();

// All routes here are protected and require admin role
router.get('/dashboard', protect, adminProtect, getDashboardData);

// Seller Management
router.get('/sellers', protect, adminProtect, getSellers);
router.put('/sellers/:id/status', protect, adminProtect, updateSellerStatus);

// Seller Products Management
router.get('/products', protect, adminProtect, getSellerProducts);
router.put('/products/:id/status', protect, adminProtect, updateProductStatus);

module.exports = router;
