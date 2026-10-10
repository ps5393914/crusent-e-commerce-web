import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock } from 'react-icons/fi';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/auth/register`, {
        email, password, confirmPassword
      });
      
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container-modern">
        <div className="auth-left">
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your email to get started</p>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Register illustration" className="auth-illustration" />
        </div>
        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}
            
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

            <div className="modern-input-group">
              <FiLock className="input-icon" />
              <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            
            <p className="terms-text">By continuing, you agree to CRUSENT's <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</p>

            <button type="submit" className="btn-modern-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Continue'}
            </button>
            
            <button type="button" className="btn-modern-secondary" onClick={() => navigate('/login')}>
              Existing User? Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
