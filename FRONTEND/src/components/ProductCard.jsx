import React from 'react';
import { Link } from 'react-router-dom';
import PriceComparison from './PriceComparison';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <img src={product.image} alt={product.name} className="product-image" />
        <h3 className="product-title" title={product.name}>{product.name}</h3>
        <p className="product-desc">{product.description}</p>
      </Link>
      <PriceComparison amazon={product.amazon} meesho={product.meesho} flipkart={product.flipkart} inline={true} />
    </div>
  );
};

export default ProductCard;
