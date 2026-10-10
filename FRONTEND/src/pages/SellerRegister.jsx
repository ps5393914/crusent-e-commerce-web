import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    storeName: '',
    businessAddress: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/seller/auth/register`,
        formData,
        config
      );

      setSuccess(data.message || 'Registration successful. Pending admin approval.');
      setTimeout(() => navigate('/seller/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '10px' }}>Register as a Seller</h2>
        <p style={{ color: '#878787', marginBottom: '20px' }}>Join our platform and start selling</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '15px', background: '#e8f5e9', padding: '10px', borderRadius: '4px' }}>{success}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Your full name" />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Business email" />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="Contact number" />
          </div>

          <div className="form-group">
            <label>Store / Business Name</label>
            <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required placeholder="Your store name" />
          </div>

          <div className="form-group">
            <label>Business Address</label>
            <textarea name="businessAddress" value={formData.businessAddress} onChange={handleChange} required placeholder="Full business address" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Seller'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Already have a seller account? <Link to="/seller/login">Login Here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
