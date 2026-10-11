import { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiGrid, FiHeart, FiUser } from 'react-icons/fi';
import { MdOutlineCompareArrows } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';

const BottomNav = () => {
  const { user } = useContext(AuthContext);
  const { wishlistCount } = useContext(WishlistContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoriesClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const catEl = document.getElementById('category-bar-section');
      if (catEl) {
        catEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#categories');
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const compEl = document.getElementById('comparison-deals-section');
      if (compEl) {
        compEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#compare');
    }
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `bottom-nav-item ${isActive && location.search === '' && !location.hash ? 'active' : ''}`}
      >
        <FiHome className="bottom-nav-icon" />
        <span className="bottom-nav-label">Home</span>
      </NavLink>

      <button
        onClick={handleCategoriesClick}
        className="bottom-nav-item"
        type="button"
      >
        <FiGrid className="bottom-nav-icon" />
        <span className="bottom-nav-label">Categories</span>
      </button>

      <button
        onClick={handleCompareClick}
        className="bottom-nav-item"
        type="button"
      >
        <MdOutlineCompareArrows className="bottom-nav-icon" />
        <span className="bottom-nav-label">Compare</span>
      </button>

      <NavLink
        to="/profile?tab=wishlist"
        className={({ isActive }) => `bottom-nav-item ${location.search.includes('wishlist') ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon-wrap">
          <FiHeart className="bottom-nav-icon" />
          {wishlistCount > 0 && (
            <span className="bottom-nav-badge">{wishlistCount}</span>
          )}
        </div>
        <span className="bottom-nav-label">Wishlist</span>
      </NavLink>

      <NavLink
        to={user ? "/profile" : "/login"}
        className={({ isActive }) => `bottom-nav-item ${isActive && !location.search.includes('wishlist') ? 'active' : ''}`}
      >
        <FiUser className="bottom-nav-icon" />
        <span className="bottom-nav-label">{user ? 'Account' : 'Login'}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
