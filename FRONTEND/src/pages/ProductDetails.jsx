import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PriceComparison from '../components/PriceComparison';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading product details...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!product) return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found.</div>;

  return (
    <div style={{ padding: '30px 0' }}>
      <Link to="/" style={{ color: '#2874f0', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Results
      </Link>
      
      <div style={{ display: 'flex', gap: '30px', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'contain', borderRadius: '4px' }} 
          />
        </div>

        <div style={{ flex: '2 1 500px' }}>
          <div style={{ color: '#878787', fontSize: '14px', marginBottom: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {product.category}
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '15px' }}>{product.name}</h1>
          
          <div style={{ marginBottom: '20px', lineHeight: '1.6', color: '#333' }}>
            <strong>Description:</strong>
            <p>{product.description}</p>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#212121', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Price Comparison</h3>
            <PriceComparison amazon={product.amazon} meesho={product.meesho} flipkart={product.flipkart} inline={false} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
