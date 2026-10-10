import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'add_product', 'profile'
  
  // New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: '',
    specifications: ''
  });

  const fetchProfileAndProducts = async () => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      };
      
      const baseURL = import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com';
      
      const [profileRes, productsRes] = await Promise.all([
        axios.get(`${baseURL}/api/seller/profile`, config),
        axios.get(`${baseURL}/api/seller/products`, config)
      ]);
      
      setProfile(profileRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      };
      const baseURL = import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com';
      await axios.post(`${baseURL}/api/seller/products`, formData, config);
      alert('Product added successfully. Pending admin approval.');
      setFormData({ name: '', description: '', category: '', price: '', image: '', specifications: '' });
      setActiveTab('products');
      fetchProfileAndProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const config = { withCredentials: true };
      const baseURL = import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com';
      await axios.delete(`${baseURL}/api/seller/products/${id}`, config);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Seller Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('products')}
          style={{ padding: '10px 20px', background: activeTab === 'products' ? '#2874f0' : '#ddd', color: activeTab === 'products' ? '#fff' : '#333', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          My Products
        </button>
        <button 
          onClick={() => setActiveTab('add_product')}
          style={{ padding: '10px 20px', background: activeTab === 'add_product' ? '#2874f0' : '#ddd', color: activeTab === 'add_product' ? '#fff' : '#333', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          Add Product
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ padding: '10px 20px', background: activeTab === 'profile' ? '#2874f0' : '#ddd', color: activeTab === 'profile' ? '#fff' : '#333', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          My Profile
        </button>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        
        {activeTab === 'profile' && profile && (
          <div>
            <h2>Store Profile</h2>
            <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
              <p><strong>Seller Name:</strong> {profile.full_name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone_number}</p>
              <p><strong>Store Name:</strong> {profile.store_name}</p>
              <p><strong>Business Address:</strong> {profile.business_address}</p>
              <p>
                <strong>Account Status:</strong> 
                <span style={{ marginLeft: '10px', padding: '4px 8px', borderRadius: '4px', background: profile.status === 'approved' ? '#e8f5e9' : '#fff3e0', color: profile.status === 'approved' ? '#2e7d32' : '#f57c00' }}>
                  {profile.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <h2>My Products</h2>
            {products.length === 0 ? (
              <p style={{ marginTop: '20px' }}>You have not added any products yet.</p>
            ) : (
              <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Image</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Name</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Price</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Category</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>
                        <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                      </td>
                      <td style={{ padding: '12px' }}>{p.name}</td>
                      <td style={{ padding: '12px' }}>₹{parseFloat(p.price).toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>{p.category}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: p.status === 'approved' ? '#e8f5e9' : p.status === 'rejected' ? '#ffebee' : '#fff3e0', color: p.status === 'approved' ? '#2e7d32' : p.status === 'rejected' ? '#c62828' : '#f57c00' }}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: '6px 12px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'add_product' && (
          <div>
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct} style={{ marginTop: '20px', maxWidth: '600px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Image URL</label>
                <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="e.g. /images/default.jpg or https://..." style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}></textarea>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Specifications</label>
                <textarea name="specifications" value={formData.specifications} onChange={handleInputChange} placeholder="Enter specifications..." style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}></textarea>
              </div>
              <button type="submit" style={{ padding: '12px 24px', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
                Submit Product
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellerDashboard;
