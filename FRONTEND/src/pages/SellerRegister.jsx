import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiShoppingBag, 
  FiMapPin, 
  FiLock, 
  FiCheckCircle, 
  FiShield, 
  FiTrendingUp, 
  FiZap 
} from 'react-icons/fi';

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
      setError('Passwords do not match. Please ensure both passwords match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
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

      setSuccess(data.message || 'Registration successful! Your seller account is pending admin verification.');
      setTimeout(() => navigate('/seller/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-auth-page">
      <div className="seller-auth-card">
        {/* Left Hero Brand Panel */}
        <div className="seller-auth-sidebar">
          <div className="seller-sidebar-header">
            <span className="seller-sidebar-badge">
              <FiZap /> CRUSENT SELLER HUB
            </span>
            <h1 className="seller-sidebar-title">Start Selling Across India</h1>
            <p className="seller-sidebar-desc">
              Reach millions of active buyers with 0% setup fee, instant listing tools, and verified merchant credentials.
            </p>

            <div className="seller-perks-list">
              <div className="seller-perk-row">
                <div className="seller-perk-row-icon">
                  <FiCheckCircle />
                </div>
                <div className="seller-perk-row-text">
                  <h5>Fast Store Setup</h5>
                  <p>Register your store in minutes with simple verification</p>
                </div>
              </div>

              <div className="seller-perk-row">
                <div className="seller-perk-row-icon">
                  <FiTrendingUp />
                </div>
                <div className="seller-perk-row-text">
                  <h5>Nationwide Customer Reach</h5>
                  <p>Access high daily shopper traffic without upfront marketing costs</p>
                </div>
              </div>

              <div className="seller-perk-row">
                <div className="seller-perk-row-icon">
                  <FiShield />
                </div>
                <div className="seller-perk-row-text">
                  <h5>Verified Merchant Badge</h5>
                  <p>Build buyer confidence with verified store certification</p>
                </div>
              </div>
            </div>
          </div>

          <div className="seller-sidebar-footer">
            Over <strong>10,000+ businesses</strong> trust CRUSENT to power their online sales.
          </div>
        </div>

        {/* Right Form Area */}
        <div className="seller-auth-main">
          <div className="seller-auth-heading-wrap">
            <h2 className="seller-auth-heading">Register as a Seller</h2>
            <p className="seller-auth-subheading">Fill in your business details to apply for a seller profile</p>
          </div>

          {error && (
            <div className="seller-auth-alert-error" role="alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          {success && (
            <div className="seller-auth-alert-success" role="alert">
              <span>✓ {success}</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="seller-grid-form">
              {/* Full Name */}
              <div className="seller-input-group">
                <label className="seller-input-label">Full Name *</label>
                <div className="seller-input-field">
                  <FiUser className="seller-field-icon" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              {/* Business Email */}
              <div className="seller-input-group">
                <label className="seller-input-label">Business Email *</label>
                <div className="seller-input-field">
                  <FiMail className="seller-field-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@business.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="seller-input-group">
                <label className="seller-input-label">Phone Number *</label>
                <div className="seller-input-field">
                  <FiPhone className="seller-field-icon" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              {/* Store Name */}
              <div className="seller-input-group">
                <label className="seller-input-label">Store / Business Name *</label>
                <div className="seller-input-field">
                  <FiShoppingBag className="seller-field-icon" />
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Apex Electronics"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div className="seller-input-group seller-col-full">
                <label className="seller-input-label">Business Address *</label>
                <div className="seller-input-field" style={{ alignItems: 'flex-start' }}>
                  <FiMapPin className="seller-field-icon" style={{ marginTop: '3px' }} />
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    required
                    rows="2"
                    placeholder="Full registered warehouse or store address"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="seller-input-group">
                <label className="seller-input-label">Password *</label>
                <div className="seller-input-field">
                  <FiLock className="seller-field-icon" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="seller-input-group">
                <label className="seller-input-label">Confirm Password *</label>
                <div className="seller-input-field">
                  <FiLock className="seller-field-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="seller-col-full">
                <p className="seller-terms-note">
                  By clicking Register, you agree to CRUSENT's <a href="#">Seller Terms of Service</a> and <a href="#">Merchant Agreement</a>.
                </p>
              </div>

              {/* Submit Button */}
              <div className="seller-col-full">
                <button type="submit" className="btn-seller-submit" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Creating Your Store...' : 'Register as a Seller'}
                </button>
              </div>
            </div>
          </form>

          <div className="seller-auth-links-footer">
            <p>
              Already have a seller account? <Link to="/seller/login">Login to Seller Hub</Link>
            </p>
            <p>
              <Link to="/login" style={{ color: '#878787', fontSize: '12.5px' }}>
                Are you a customer? Back to Buyer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
