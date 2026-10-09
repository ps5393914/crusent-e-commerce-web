import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">CRUSENT</Link>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search for products, brands and more" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit"><FiSearch /></button>
        </form>

        <div className="nav-links">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ fontWeight: 'bold', color: '#f2a900' }}>Admin Dashboard</Link>
              )}
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FiUser /> {user.email.split('@')[0]}
              </Link>
              <button onClick={handleLogout} className="login-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
