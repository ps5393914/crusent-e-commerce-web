import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ padding: '40px 0', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px', color: '#2874f0' }}>My Profile</h2>
        <div style={{ marginBottom: '20px' }}>
          <strong>Email:</strong> {user.email}
        </div>
        <p style={{ color: '#878787', marginBottom: '20px' }}>
          Welcome to CRUSENT! This is a simple profile page. In a full production application, you would see your past orders, wishlist, and account settings here.
        </p>
        <button onClick={logout} className="btn-primary" style={{ backgroundColor: '#ff6161', color: 'white' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
