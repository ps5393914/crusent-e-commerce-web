const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const productsFilePath = path.join(__dirname, '../data/products.json');

const getProducts = async (req, res) => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    let products = JSON.parse(data);

    // Fetch approved seller products
    const sellerProductsRes = await pool.query(`
      SELECT sp.*, s.store_name, s.full_name as seller_name
      FROM seller_products sp
      JOIN sellers s ON sp.seller_id = s.id
      WHERE sp.status = 'approved'
    `);
    
    const formattedSellerProducts = sellerProductsRes.rows.map(sp => ({
      id: sp.id,
      name: sp.name,
      image: sp.image,
      description: sp.description,
      category: sp.category,
      seller_info: {
        storeName: sp.store_name,
        sellerName: sp.seller_name
      },
      price: parseFloat(sp.price),
      specifications: sp.specifications
    }));

    products = [...products, ...formattedSellerProducts];
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (productId.startsWith('prod_')) {
      // It's a seller product
      const productRes = await pool.query(`
        SELECT sp.*, s.store_name, s.full_name as seller_name
        FROM seller_products sp
        JOIN sellers s ON sp.seller_id = s.id
        WHERE sp.id = $1 AND sp.status = 'approved'
      `, [productId]);

      if (productRes.rows.length > 0) {
        const sp = productRes.rows[0];
        return res.status(200).json({
          id: sp.id,
          name: sp.name,
          image: sp.image,
          description: sp.description,
          category: sp.category,
          seller_info: {
            storeName: sp.store_name,
            sellerName: sp.seller_name
          },
          price: parseFloat(sp.price),
          specifications: sp.specifications
        });
      }
    } else {
      // It's a JSON product
      const data = fs.readFileSync(productsFilePath, 'utf-8');
      const products = JSON.parse(data);
      const product = products.find(p => p.id === parseInt(productId));
      
      if (product) {
        return res.status(200).json(product);
      }
    }
    
    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

module.exports = {
  getProducts,
  getProductById
};
