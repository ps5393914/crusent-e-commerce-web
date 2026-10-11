import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiZap, FiTrendingUp, FiShield } from 'react-icons/fi';

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/seller/auth/login`,
        { email, password },
        config
      );

      login(data.user);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or account pending approval');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-auth-page">
      <div className="seller-auth-card seller-auth-card-login">
        {/* Left Hero Sidebar */}
        <div className="seller-auth-sidebar">
          <div className="seller-sidebar-header">
            <span className="seller-sidebar-badge">
              <FiZap /> CRUSENT SELLER HUB
            </span>
            <h1 className="seller-sidebar-title">Welcome Back, Seller</h1>
            <p className="seller-sidebar-desc">
              Manage your orders, update product catalogs, and review daily sales analytics from your central dashboard.
            </p>

            <div className="seller-perks-list">
              <div className="seller-perk-row">
                <div className="seller-perk-row-icon">
                  <FiTrendingUp />
                </div>
                <div className="seller-perk-row-text">
                  <h5>Live Analytics</h5>
                  <p>Track store visits, sales and customer ratings</p>
                </div>
              </div>

              <div className="seller-perk-row">
                <div className="seller-perk-row-icon">
                  <FiShield />
                </div>
                <div className="seller-perk-row-text">
                  <h5>Secure Payments</h5>
                  <p>Fast and protected settlements for every completed order</p>
                </div>
              </div>
            </div>
          </div>

          <div className="seller-sidebar-footer">
            Need seller support? Contact our 24/7 Merchant Desk.
          </div>
        </div>

        {/* Right Form Main */}
        <div className="seller-auth-main">
          <div className="seller-auth-heading-wrap">
            <h2 className="seller-auth-heading">Seller Login</h2>
            <p className="seller-auth-subheading">Access your merchant portal & product inventory</p>
          </div>

          {error && (
            <div className="seller-auth-alert-error" role="alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="seller-input-group">
              <label className="seller-input-label">Business Email</label>
              <div className="seller-input-field">
                <FiMail className="seller-field-icon" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Enter registered business email"
                />
              </div>
            </div>

            <div className="seller-input-group">
              <label className="seller-input-label">Password</label>
              <div className="seller-input-field">
                <FiLock className="seller-field-icon" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button type="submit" className="btn-seller-submit" disabled={loading}>
              {loading ? 'Verifying Credentials...' : 'Login to Seller Dashboard'}
            </button>
          </form>

          <div className="seller-auth-links-footer">
            <p>
              Don't have a seller account? <Link to="/seller/register">Register as a Seller</Link>
            </p>
            <p>
              <Link to="/login" style={{ color: '#878787', fontSize: '12.5px' }}>
                Customer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
