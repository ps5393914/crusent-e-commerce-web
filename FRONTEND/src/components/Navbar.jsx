import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { 
  FiSearch, 
  FiMic, 
  FiUser, 
  FiHeart, 
  FiX, 
  FiShoppingBag,
  FiShield,
  FiLogOut,
  FiCheckCircle
} from 'react-icons/fi';
import VoiceSearchModal from './VoiceSearchModal';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { wishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Sync search input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) {
      setSearchQuery(q);
    } else if (location.pathname === '/') {
      setSearchQuery('');
    }
  }, [location.search, location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleVoiceSearch = (recognizedText) => {
    setSearchQuery(recognizedText);
    navigate(`/?search=${encodeURIComponent(recognizedText.trim())}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate('/');
  };

  return (
    <>
      <header className="modern-navbar">
        <div className="container navbar-content">
          {/* Brand Logo & Tagline */}
          <div className="brand-wrapper">
            <Link to="/" className="brand-logo" title="CRUSENT - E-Commerce Price Comparison">
              <span className="brand-main">CRUSENT</span>
              <span className="brand-sub">
                Compare <span className="brand-plus">Plus+</span>
              </span>
            </Link>
          </div>

          {/* Prominent Search Bar with Search & Voice Search */}
          <form className="modern-search-bar" onSubmit={handleSearchSubmit}>
            <button type="submit" className="search-icon-btn" aria-label="Search">
              <FiSearch />
            </button>
            <input
              type="text"
              placeholder="Search for Mobiles, Electronics, Brands & Compare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
            <button
              type="button"
              className="voice-search-trigger-btn"
              onClick={() => setIsVoiceOpen(true)}
              title="Search by Voice"
              aria-label="Search by Voice"
            >
              <FiMic />
            </button>
          </form>

          {/* Desktop & Mobile Top Actions */}
          <div className="navbar-actions">
            {/* Wishlist Link with Badge */}
            <Link
              to="/profile?tab=wishlist"
              className="nav-action-item wishlist-nav-link"
              title="My Wishlist"
            >
              <div className="action-icon-wrap">
                <FiHeart />
                {wishlistCount > 0 && (
                  <span className="nav-badge-pill">{wishlistCount}</span>
                )}
              </div>
              <span className="nav-action-label hide-mobile">Wishlist</span>
            </Link>

            {/* Seller Account Button */}
            {!user || user.role !== 'seller' ? (
              <Link to="/seller/login" className="seller-hub-chip hide-mobile">
                <FiShoppingBag style={{ marginRight: '5px' }} />
                Become a Seller
              </Link>
            ) : (
              <Link to="/seller/dashboard" className="seller-hub-chip active hide-mobile">
                <FiShoppingBag style={{ marginRight: '5px' }} />
                Seller Hub
              </Link>
            )}

            {/* User Account / Login */}
            {user ? (
              <div className="user-dropdown-container">
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="user-avatar-circle">
                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <span className="user-name-text hide-mobile">
                    {user.role === 'admin'
                      ? 'Admin'
                      : user.name || user.email.split('@')[0]}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="user-menu-header">
                      <strong>{user.email}</strong>
                      <span className="user-role-badge">
                        {user.role === 'admin' ? '🛡️ Administrator' : user.role === 'seller' ? '💼 Merchant' : '👤 Crusent Shopper'}
                      </span>
                    </div>

                    <div className="user-menu-links">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="user-menu-item"
                      >
                        <FiUser /> My Profile & Wishlist
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="user-menu-item"
                          style={{ color: '#2874f0', fontWeight: 'bold' }}
                        >
                          <FiShield /> Admin Dashboard
                        </Link>
                      )}

                      {user.role === 'seller' ? (
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="user-menu-item"
                          style={{ color: '#ff9f00', fontWeight: 'bold' }}
                        >
                          <FiShoppingBag /> Seller Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/seller/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="user-menu-item"
                        >
                          <FiShoppingBag /> Crusent Seller Hub
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="user-menu-item logout-btn"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-login-btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSearch={handleVoiceSearch}
      />
    </>
  );
};

export default Navbar;
