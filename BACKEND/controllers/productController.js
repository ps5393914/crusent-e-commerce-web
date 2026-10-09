const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const getProducts = (req, res) => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    const products = JSON.parse(data);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const getProductById = (req, res) => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    const products = JSON.parse(data);
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

module.exports = {
  getProducts,
  getProductById
};
