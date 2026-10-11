import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { 
  FiUser, 
  FiHeart, 
  FiSettings, 
  FiLogOut, 
  FiShoppingBag, 
  FiShield, 
  FiExternalLink, 
  FiTrash2, 
  FiCheckCircle,
  FiAward
} from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('profile');

  // Check query parameter ?tab=wishlist
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'wishlist') {
      setActiveTab('wishlist');
    }
  }, [location.search]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-page-container">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
        <div className="profile-header-info">
          <h2>{user.name || user.email.split('@')[0]}</h2>
          <p className="profile-email-text">{user.email}</p>
          <span className="profile-badge-pill">
            {user.role === 'admin'
              ? '🛡️ CRUSENT Administrator'
              : user.role === 'seller'
              ? '💼 Verified Merchant'
              : '🌟 CRUSENT Plus Member'}
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="profile-tabs-bar">
        <button
          type="button"
          className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser style={{ marginRight: '6px' }} /> Account Details
        </button>

        <button
          type="button"
          className={`profile-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <FiHeart style={{ marginRight: '6px' }} /> Saved Wishlist ({wishlist.length})
        </button>

        <button
          type="button"
          className={`profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings style={{ marginRight: '6px' }} /> Settings & Preferences
        </button>
      </div>

      {/* Tab 1: Account Details */}
      {activeTab === 'profile' && (
        <div className="profile-tab-pane">
          <div className="profile-details-grid">
            <div className="profile-info-box">
              <h3>Personal Information</h3>
              <div className="info-row">
                <span className="info-label">Account Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type:</span>
                <span className="info-value" style={{ textTransform: 'capitalize' }}>{user.role || 'Shopper'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Price Alert Notifications:</span>
                <span className="info-value" style={{ color: '#388e3c' }}>Enabled (Best Deal Tracking)</span>
              </div>
            </div>

            <div className="profile-quick-links-box">
              <h3>Merchant & Management Services</h3>
              <p>Explore Crusent e-commerce tools and business integrations:</p>

              <div className="service-links-list">
                {user.role === 'seller' ? (
                  <Link to="/seller/dashboard" className="service-link-card seller">
                    <FiShoppingBag className="service-icon" />
                    <div>
                      <strong>Seller Dashboard</strong>
                      <p>Manage product listings, inventory, and orders.</p>
                    </div>
                  </Link>
                ) : (
                  <Link to="/seller/login" className="service-link-card seller">
                    <FiShoppingBag className="service-icon" />
                    <div>
                      <strong>Open Crusent Seller Account</strong>
                      <p>Sell directly to smart shoppers with 0% setup fee.</p>
                    </div>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link to="/admin" className="service-link-card admin">
                    <FiShield className="service-icon" />
                    <div>
                      <strong>CRUSENT Admin Panel</strong>
                      <p>Approve merchant registrations and inspect catalog.</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="profile-logout-row">
            <button type="button" onClick={logout} className="profile-logout-btn">
              <FiLogOut style={{ marginRight: '6px' }} /> Log Out from CRUSENT
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Saved / Wishlist Products */}
      {activeTab === 'wishlist' && (
        <div className="profile-tab-pane">
          <div className="wishlist-pane-header">
            <h3>Saved Products & Price Trackers</h3>
            <span className="wishlist-count-label">{wishlist.length} Saved</span>
          </div>

          {wishlist.length === 0 ? (
            <div className="empty-wishlist-card">
              <div className="empty-heart-icon">💖</div>
              <h4>Your wishlist is empty</h4>
              <p>Save products from home or product details to track deals and compare prices anytime.</p>
              <Link to="/" className="btn-modern-primary" style={{ display: 'inline-block', marginTop: '15px' }}>
                Explore Trending Deals
              </Link>
            </div>
          ) : (
            <div className="wishlist-items-grid">
              {wishlist.map((item) => {
                const hasComp = item.amazon && item.meesho && item.flipkart;
                let minP = item.price;
                let winnerName = '';
                if (hasComp) {
                  const list = [
                    { name: 'Amazon', price: item.amazon.price, url: item.amazon.productUrl },
                    { name: 'Flipkart', price: item.flipkart.price, url: item.flipkart.productUrl },
                    { name: 'Meesho', price: item.meesho.price, url: item.meesho.productUrl },
                  ];
                  minP = Math.min(...list.map((i) => i.price));
                  winnerName = list.find((i) => i.price === minP)?.name;
                }

                return (
                  <div key={item.id} className="wishlist-item-card">
                    <img src={item.image} alt={item.name} className="wishlist-item-img" />
                    <div className="wishlist-item-content">
                      <h4 title={item.name}>{item.name}</h4>
                      <span className="wishlist-item-category">{item.category}</span>

                      <div className="wishlist-item-pricing">
                        <span className="wishlist-price">₹{minP?.toLocaleString()}</span>
                        {winnerName && (
                          <span className="wishlist-winner-badge">
                            Lowest on {winnerName}
                          </span>
                        )}
                      </div>

                      <div className="wishlist-item-actions">
                        <Link to={`/product/${item.id}`} className="wishlist-view-btn">
                          View Comparison &rarr;
                        </Link>
                        <button
                          type="button"
                          className="wishlist-remove-btn"
                          onClick={() => removeFromWishlist(item.id)}
                          title="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Settings & Preferences */}
      {activeTab === 'settings' && (
        <div className="profile-tab-pane">
          <div className="settings-card">
            <h3>Comparison & Shopping Preferences</h3>
            <div className="settings-item">
              <div>
                <strong>Default Preferred Marketplace</strong>
                <p>Highlight best offers from your favorite platform first.</p>
              </div>
              <select className="settings-select" defaultValue="auto">
                <option value="auto">Auto (Lowest Price Always)</option>
                <option value="flipkart">Flipkart Priority</option>
                <option value="amazon">Amazon Priority</option>
                <option value="meesho">Meesho Priority</option>
              </select>
            </div>

            <div className="settings-item">
              <div>
                <strong>Price Drop Alerts</strong>
                <p>Receive notifications when prices fall across compared sellers.</p>
              </div>
              <input type="checkbox" defaultChecked className="settings-checkbox" />
            </div>

            <div className="settings-item">
              <div>
                <strong>Currency Display</strong>
                <p>Standard Indian Rupee (₹ INR).</p>
              </div>
              <span className="settings-val">₹ INR</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
