import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
    <div className="auth-container">
      <div className="auth-box">
        <h2 style={{ marginBottom: '10px' }}>Seller Login</h2>
        <p style={{ color: '#878787', marginBottom: '20px' }}>Manage your products and store</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your registered email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Seller Dashboard'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Don't have a seller account? <Link to="/seller/register">Register as Seller</Link></p>
          <p><Link to="/login">User Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
