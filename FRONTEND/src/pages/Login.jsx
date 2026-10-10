import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/auth/login`, {
        email, password
      }, { withCredentials: true });
      
      login(data.user);
      if (data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container-modern">
        <div className="auth-left">
          <h2>Login</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login illustration" className="auth-illustration" />
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            
            <div className="modern-input-group">
              <FiMail className="input-icon" />
              <input 
                type="email" 
                placeholder="Enter Email Address"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="modern-input-group">
              <FiLock className="input-icon" />
              <input 
                type="password" 
                placeholder="Enter Password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <p className="terms-text">By continuing, you agree to CRUSENT's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</p>

            <button type="submit" className="btn-modern-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="auth-footer">
              <Link to="/register" className="create-account-link">New to CRUSENT? Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
