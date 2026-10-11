import { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/products`);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px 0' }}>
      
      {/* Category Bar */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '20px',
              background: selectedCategory === cat ? '#2874f0' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#212121',
              cursor: 'pointer',
              fontWeight: selectedCategory === cat ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2>
        {searchQuery 
          ? `Search Results for "${searchQuery}" ${selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}` 
          : selectedCategory !== 'All' 
            ? `${selectedCategory} Products` 
            : 'Best Deals Comparison'}
      </h2>
      
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>No products found matching your criteria.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Seller Account Section Under Products */}
      <section className="seller-banner-section" aria-label="Seller Account Information">
        <div className="seller-banner-wrapper">
          <div className="seller-banner-header">
            <span className="seller-banner-badge">CRUSENT SELLER HUB</span>
            <h2 className="seller-banner-heading">Become a Seller on CRUSENT</h2>
            <p className="seller-banner-subheading">
              Sell your products to thousands of shoppers on Crusent. Start your online business with zero hassle, dedicated inventory tools, and transparent order tracking.
            </p>
          </div>

          <div className="seller-perks-grid">
            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">🚀</div>
              <h3>Fast Setup & Onboarding</h3>
              <p>Register your store in minutes, submit verification, and start listing inventory immediately.</p>
            </div>

            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">💰</div>
              <h3>0% Setup Fee</h3>
              <p>Maximize your revenue with transparent terms and direct access to active buyers.</p>
            </div>

            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">📊</div>
              <h3>Seller Dashboard & Controls</h3>
              <p>Live inventory management, instant price adjustments, and store catalog controls.</p>
            </div>

            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">🛡️</div>
              <h3>Verified Store Badge</h3>
              <p>Build buyer confidence with verified merchant credentials displayed directly on your products.</p>
            </div>
          </div>

          <div className="seller-banner-footer">
            <div className="seller-banner-cta-text">
              <h4>Ready to start selling your products on CRUSENT?</h4>
              <p>Join our growing seller network and grow your business today.</p>
            </div>
            <div className="seller-banner-buttons">
              {user && user.role === 'seller' ? (
                <Link to="/seller/dashboard" className="seller-btn-primary">
                  Go to Seller Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/seller/register" className="seller-btn-primary">
                    Create Seller Account
                  </Link>
                  <Link to="/seller/login" className="seller-btn-secondary">
                    Seller Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
