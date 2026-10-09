const express = require('express');
const { protect, adminProtect } = require('../middleware/authMiddleware');
const { getDashboardData } = require('../controllers/adminController');

const router = express.Router();

// All routes here are protected and require admin role
router.get('/dashboard', protect, adminProtect, getDashboardData);

module.exports = router;
