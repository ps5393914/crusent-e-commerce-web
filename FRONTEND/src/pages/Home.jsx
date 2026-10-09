import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px 0' }}>
      
      {/* Category Bar */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '20px',
              background: selectedCategory === cat ? '#2874f0' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#212121',
              cursor: 'pointer',
              fontWeight: selectedCategory === cat ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2>
        {searchQuery 
          ? `Search Results for "${searchQuery}" ${selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}` 
          : selectedCategory !== 'All' 
            ? `${selectedCategory} Products` 
            : 'Best Deals Comparison'}
      </h2>
      
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>No products found matching your criteria.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
