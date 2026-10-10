import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/admin/dashboard`, {
          withCredentials: true
        });
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('Failed to fetch admin data. Are you authorized?');
          setLoading(false);
        }
      }
    };

    fetchDashboard();
  }, [user, navigate, logout]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!dashboardData) return null;

  return (
    <div style={{ padding: '30px 0' }}>
      <h1 style={{ marginBottom: '20px', color: '#2874f0' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#878787', marginBottom: '10px' }}>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData.stats.totalUsers}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#878787', marginBottom: '10px' }}>Total Sales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{dashboardData.stats.totalSales.toLocaleString()}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#878787', marginBottom: '10px' }}>Active Sessions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData.stats.activeSessions}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        
        <div style={{ flex: '1 1 400px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px' }}>Recent Customers</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.customers.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex: '1 1 400px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px' }}>Recent Orders</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      background: o.status === 'Shipped' ? '#e8f5e9' : '#fff3e0',
                      color: o.status === 'Shipped' ? '#2e7d32' : '#e65100'
                    }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div style={{ marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '15px' }}>Logged-in Users</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login Time</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.users && dashboardData.users.map(u => (
              <tr key={u.id}>
                <td>{u.role === 'admin' ? 'CRUSENT Administrator' : u.email.split('@')[0]}</td>
                <td>{u.role === 'admin' ? 'Administrator' : u.email}</td>
                <td>{u.role === 'admin' ? 'Admin' : 'Customer'}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    background: u.status === 'Online' ? '#e8f5e9' : '#f5f5f5',
                    color: u.status === 'Online' ? '#2e7d32' : '#757575',
                    fontWeight: 'bold'
                  }}>
                    {u.status || 'Offline'}
                  </span>
                </td>
                <td>{u.last_login_time ? new Date(u.last_login_time).toLocaleString() : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
