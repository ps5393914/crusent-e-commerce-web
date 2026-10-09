const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const driveRoutes = require('./routes/driveRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { initDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Adjust frontend port if needed
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('CRUSENT API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
