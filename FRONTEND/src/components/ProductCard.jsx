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
      {product.seller_info ? (
        <div style={{ marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2874f0' }}>₹{product.price?.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#878787', marginTop: '5px' }}>Sold by: {product.seller_info.storeName}</div>
        </div>
      ) : (
        <PriceComparison amazon={product.amazon} meesho={product.meesho} flipkart={product.flipkart} inline={true} />
      )}
    </div>
  );
};

export default ProductCard;
