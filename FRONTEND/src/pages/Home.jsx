import { useState, useEffect, useContext, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import BannerCarousel from '../components/BannerCarousel';
import { AuthContext } from '../context/AuthContext';
import { 
  FiClock, 
  FiFilter, 
  FiZap
} from 'react-icons/fi';
import { 
  MdOutlineSmartphone, 
  MdOutlineLaptop, 
  MdHeadphones, 
  MdWatch, 
  MdOutlineCheckroom, 
  MdOutlineKitchen, 
  MdSportsEsports, 
  MdTv,
  MdAutoAwesome
} from 'react-icons/md';

// Category definitions with Flipkart-style visual icons
const CATEGORY_ITEMS = [
  { id: 'All', label: 'All Deals', icon: <MdAutoAwesome /> },
  { id: 'Smartphones', label: 'Mobiles', icon: <MdOutlineSmartphone /> },
  { id: 'Laptops', label: 'Laptops', icon: <MdOutlineLaptop /> },
  { id: 'Headphones', label: 'Audio', icon: <MdHeadphones /> },
  { id: 'Smart Watches', label: 'Watches', icon: <MdWatch /> },
  { id: 'Shoes', label: 'Fashion', icon: <MdOutlineCheckroom /> },
  { id: 'Home Appliances', label: 'Appliances', icon: <MdOutlineKitchen /> },
  { id: 'Gaming Consoles', label: 'Gaming', icon: <MdSportsEsports /> },
  { id: 'Televisions', label: 'TVs', icon: <MdTv /> },
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [platformFilter, setPlatformFilter] = useState('all'); // 'all', 'flipkart', 'amazon', 'meesho'
  
  // Deals countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/products`
        );
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Live countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pName = (p.name || '').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();

      const matchesSearch =
        !searchQuery ||
        pName.includes(searchQuery) ||
        pCat.includes(searchQuery) ||
        pDesc.includes(searchQuery);

      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        matchesCategory = p.category === selectedCategory;
      }

      let matchesPlatform = true;
      if (platformFilter !== 'all' && p.amazon && p.meesho && p.flipkart) {
        const minPrice = Math.min(p.amazon.price, p.meesho.price, p.flipkart.price);
        if (platformFilter === 'flipkart') matchesPlatform = p.flipkart.price === minPrice;
        if (platformFilter === 'amazon') matchesPlatform = p.amazon.price === minPrice;
        if (platformFilter === 'meesho') matchesPlatform = p.meesho.price === minPrice;
      }

      return matchesSearch && matchesCategory && matchesPlatform;
    }).sort((a, b) => {
      const getMin = (item) => {
        if (item.amazon && item.flipkart && item.meesho) {
          return Math.min(item.amazon.price, item.flipkart.price, item.meesho.price);
        }
        return item.price || 0;
      };

      const getRating = (item) => {
        if (item.amazon && item.flipkart && item.meesho) {
          return (item.amazon.rating + item.flipkart.rating + item.meesho.rating) / 3;
        }
        return 4.0;
      };

      if (selectedSort === 'price-low') return getMin(a) - getMin(b);
      if (selectedSort === 'price-high') return getMin(b) - getMin(a);
      if (selectedSort === 'rating') return getRating(b) - getRating(a);
      return 0; // featured
    });
  }, [products, searchQuery, selectedCategory, platformFilter, selectedSort]);

  // Featured / Top Deals for Deal of the Day section
  const topDeals = useMemo(() => {
    return products
      .filter((p) => p.amazon && p.meesho && p.flipkart)
      .slice(0, 4);
  }, [products]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (searchQuery) {
      navigate('/');
    }
  };

  return (
    <div className="home-page-container">
      {/* 1. Horizontal Product Category Bar (Flipkart Style) */}
      <section 
        id="category-bar-section" 
        className="horizontal-category-bar" 
        aria-label="Product Categories"
      >
        <div className="category-scroll-container">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`category-item-pill ${isSelected ? 'active' : ''}`}
                aria-pressed={isSelected}
              >
                <div className="category-icon-bubble">{cat.icon}</div>
                <span className="category-label">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Promotional Banner Carousel */}
      {!searchQuery && (
        <BannerCarousel
          onSelectCategory={handleCategorySelect}
          onNavigate={(url) => navigate(url)}
        />
      )}

      {/* 3. Deal of the Day / Live Comparison Strip */}
      {!searchQuery && selectedCategory === 'All' && (
        <section 
          id="comparison-deals-section" 
          className="deals-of-the-day-section" 
          aria-label="Deals of the Day"
        >
          <div className="deals-header">
            <div className="deals-title-wrap">
              <span className="deals-badge"><FiZap /> CRUSENT SPOTLIGHT</span>
              <h2 className="deals-main-heading">Best Price Comparison Deals</h2>
              <div className="deals-timer">
                <FiClock className="timer-icon" />
                <span>Ends in:</span>
                <span className="timer-clock">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <div className="deals-quick-info hide-mobile">
              <span>Verified savings across Flipkart, Amazon & Meesho</span>
            </div>
          </div>

          <div className="deals-cards-scroller">
            {topDeals.map((product) => {
              const list = [
                { name: 'Amazon', price: product.amazon.price },
                { name: 'Flipkart', price: product.flipkart.price },
                { name: 'Meesho', price: product.meesho.price },
              ];
              const minP = Math.min(...list.map((i) => i.price));
              const maxP = Math.max(...list.map((i) => i.price));
              const winnerName = list.find((i) => i.price === minP)?.name;
              const savings = maxP - minP;

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="spotlight-deal-card"
                >
                  <div className="spotlight-img-wrap">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    {savings > 0 && (
                      <span className="spotlight-save-tag">
                        Save ₹{savings.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="spotlight-info">
                    <h4 title={product.name}>{product.name}</h4>
                    <div className="spotlight-price-row">
                      <span className="spotlight-price">₹{minP.toLocaleString()}</span>
                      <span className="spotlight-winner">on {winnerName}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Controls & Filters Header */}
      <section className="listing-controls-header">
        <div className="listing-title-area">
          <h2 className="listing-heading">
            {searchQuery ? (
              <>
                Search Results for <span className="highlight-query">"{searchQuery}"</span>
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </>
            ) : selectedCategory !== 'All' ? (
              `${selectedCategory} Comparisons & Deals`
            ) : (
              'All Trending Product Comparisons'
            )}
          </h2>
          <span className="listing-count-badge">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
          </span>
        </div>

        {/* Filter & Sort Chips */}
        <div className="filter-chips-row">
          <div className="platform-filter-group">
            <span className="filter-group-label hide-mobile">
              <FiFilter style={{ marginRight: '4px' }} /> Lowest On:
            </span>
            <button
              type="button"
              className={`filter-chip ${platformFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('all')}
            >
              All Platforms
            </button>
            <button
              type="button"
              className={`filter-chip chip-fk ${platformFilter === 'flipkart' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('flipkart')}
            >
              Flipkart Best
            </button>
            <button
              type="button"
              className={`filter-chip chip-amz ${platformFilter === 'amazon' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('amazon')}
            >
              Amazon Best
            </button>
            <button
              type="button"
              className={`filter-chip chip-msh ${platformFilter === 'meesho' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('meesho')}
            >
              Meesho Best
            </button>
          </div>

          <div className="sort-dropdown-wrap">
            <label htmlFor="sort-select" className="hide-mobile">Sort by:</label>
            <select
              id="sort-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="modern-select"
            >
              <option value="featured">Featured Deals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. Products Grid */}
      {loading ? (
        <div className="loading-state-container">
          <div className="loading-spinner"></div>
          <p>Comparing live prices from Flipkart, Amazon & Meesho...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-bubble">🔍</div>
          <h3>No matching products found</h3>
          <p>
            {searchQuery
              ? `We couldn't find any products matching "${searchQuery}". Try searching for iPhone, headphones, watches, or laptops.`
              : 'Try clearing selected filters to see all available products.'}
          </p>
          <div className="empty-action-buttons">
            {searchQuery && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => navigate('/')}
              >
                Clear Search
              </button>
            )}
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                setSelectedCategory('All');
                setPlatformFilter('all');
                setSelectedSort('featured');
              }}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 6. CRUSENT Seller Account Section */}
      <section className="seller-banner-section" aria-label="Seller Account Information">
        <div className="seller-banner-wrapper">
          <div className="seller-banner-header">
            <span className="seller-banner-badge">CRUSENT SELLER HUB</span>
            <h2 className="seller-banner-heading">Become a Verified Seller on CRUSENT</h2>
            <p className="seller-banner-subheading">
              Sell your products directly alongside top marketplaces. Reach smart shoppers looking for the best deals with zero setup hassle.
            </p>
          </div>

          <div className="seller-perks-grid">
            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">🚀</div>
              <h3>Fast Setup & Onboarding</h3>
              <p>Register your store in minutes, submit verification, and start listing inventory immediately.</p>
            </div>

            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">💰</div>
              <h3>0% Setup Fee</h3>
              <p>Maximize your revenue with transparent terms and direct access to active buyers.</p>
            </div>

            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">📊</div>
              <h3>Seller Dashboard & Controls</h3>
              <p>Live inventory management, instant price adjustments, and store catalog controls.</p>
            </div>

            <div className="seller-perk-card">
              <div className="seller-perk-icon-wrap">🛡️</div>
              <h3>Verified Store Badge</h3>
              <p>Build buyer confidence with verified merchant credentials displayed directly on your products.</p>
            </div>
          </div>

          <div className="seller-banner-footer">
            <div className="seller-banner-cta-text">
              <h4>Ready to start selling your products on CRUSENT?</h4>
              <p>Join our growing merchant network and increase your sales today.</p>
            </div>
            <div className="seller-banner-buttons">
              {user && user.role === 'seller' ? (
                <Link to="/seller/dashboard" className="seller-btn-primary">
                  Go to Seller Dashboard &rarr;
                </Link>
              ) : (
                <>
                  <Link to="/seller/register" className="seller-btn-primary">
                    Create Seller Account
                  </Link>
                  <Link to="/seller/login" className="seller-btn-secondary">
                    Seller Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
