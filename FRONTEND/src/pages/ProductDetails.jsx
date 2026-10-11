import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PriceComparison from '../components/PriceComparison';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { 
  FiHeart, 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiRotateCcw, 
  FiCheckCircle, 
  FiAward, 
  FiExternalLink,
  FiShare2,
  FiMapPin
} from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Interactive delivery pincode check
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [pincodeMsg, setPincodeMsg] = useState('');

  // Selected image zoom/view
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || 'https://crusent-e-commerce-web-2.onrender.com'}/api/products/${id}`
        );
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to fetch product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading product comparison details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h3>{error || 'Product not found.'}</h3>
        <Link to="/" className="btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  const hasComparison = product.amazon && product.meesho && product.flipkart;
  let minPrice = null;
  let maxPrice = null;
  let winnerPlatform = null;
  let maxSavings = 0;
  let avgRating = 4.5;
  let totalReviews = 0;

  if (hasComparison) {
    const list = [
      { name: 'Amazon', price: product.amazon.price, rating: product.amazon.rating, reviews: product.amazon.reviewCount, url: product.amazon.productUrl },
      { name: 'Flipkart', price: product.flipkart.price, rating: product.flipkart.rating, reviews: product.flipkart.reviewCount, url: product.flipkart.productUrl },
      { name: 'Meesho', price: product.meesho.price, rating: product.meesho.rating, reviews: product.meesho.reviewCount, url: product.meesho.productUrl }
    ];
    minPrice = Math.min(...list.map((i) => i.price));
    maxPrice = Math.max(...list.map((i) => i.price));
    winnerPlatform = list.find((i) => i.price === minPrice);
    maxSavings = maxPrice - minPrice;
    avgRating = (
      (product.amazon.rating + product.flipkart.rating + product.meesho.rating) /
      3
    ).toFixed(1);
    totalReviews =
      product.amazon.reviewCount +
      product.flipkart.reviewCount +
      product.meesho.reviewCount;
  } else if (product.price) {
    minPrice = product.price;
  }

  const isFavorited = isInWishlist(product.id);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeMsg('Please enter a valid 6-digit PIN code.');
      setDeliveryInfo(null);
      return;
    }
    setPincodeMsg('');
    setDeliveryInfo({
      pincode: pincode.trim(),
      expectedDate: 'Delivery in 2 - 4 Business Days',
      isFree: true,
      codAvailable: true,
      replacement: '7 Days Replacement Policy'
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="product-details-page-wrap">
      {/* Breadcrumb Navigation */}
      <nav className="details-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="crumb-separator">/</span>
        <Link to={`/?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span className="crumb-separator">/</span>
        <span className="crumb-current">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="details-main-grid">
        {/* Left Column: Image Gallery & Quick Actions */}
        <div className="details-gallery-column">
          <div className="details-image-card">
            <div className="details-image-badge-row">
              {hasComparison && maxSavings > 0 ? (
                <span className="details-save-badge">
                  Save ₹{maxSavings.toLocaleString()} on {winnerPlatform?.name}
                </span>
              ) : (
                <span className="details-verified-badge">
                  <FiCheckCircle style={{ marginRight: '4px' }} /> Verified Product
                </span>
              )}

              <button
                type="button"
                className={`details-wishlist-btn ${isFavorited ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                title={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                aria-label={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <FiHeart />
              </button>
            </div>

            <div className="details-main-image-wrap">
              <img
                src={product.image}
                alt={product.name}
                className="details-main-img"
              />
            </div>

            <div className="details-image-actions">
              <button
                type="button"
                className="details-share-btn"
                onClick={handleShare}
              >
                <FiShare2 style={{ marginRight: '6px' }} />
                {copiedLink ? 'Link Copied!' : 'Share Deal'}
              </button>
            </div>
          </div>

          {/* Trust Guarantees Card */}
          <div className="details-trust-card">
            <h4>CRUSENT Guarantee</h4>
            <div className="trust-item">
              <FiShield className="trust-icon" />
              <div>
                <strong>Official Marketplace Links</strong>
                <p>Links redirect directly to authentic listings on Flipkart, Amazon, and Meesho.</p>
              </div>
            </div>
            <div className="trust-item">
              <FiTruck className="trust-icon" />
              <div>
                <strong>Standard Marketplace Delivery</strong>
                <p>Eligible for platform delivery guarantees, free shipping, and tracking.</p>
              </div>
            </div>
            <div className="trust-item">
              <FiRotateCcw className="trust-icon" />
              <div>
                <strong>Original Return Policy</strong>
                <p>Enjoy standard buyer protection and replacement from the respective seller.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Information, Comparison & Reviews */}
        <div className="details-info-column">
          <div className="details-header-card">
            <span className="details-category-pill">{product.category}</span>
            <h1 className="details-title">{product.name}</h1>

            {/* Ratings & Reviews summary */}
            <div className="details-rating-banner">
              <span className="rating-pill large">
                {avgRating} <FiStar className="star-icon" />
              </span>
              <span className="details-rating-count">
                {totalReviews > 0
                  ? `${totalReviews.toLocaleString()} verified ratings across platforms`
                  : 'Verified Merchant Item'}
              </span>
            </div>

            {/* Product Description */}
            <div className="details-desc-box">
              <p>{product.description}</p>
            </div>

            {/* Lowest Price Callout */}
            {hasComparison ? (
              <div className="details-best-price-callout">
                <div className="best-price-left">
                  <span className="best-price-caption">Lowest Verified Price:</span>
                  <div className="best-price-amount">
                    ₹{minPrice?.toLocaleString()}
                    <span className="best-price-platform">
                      on <strong>{winnerPlatform?.name}</strong>
                    </span>
                  </div>
                  {maxSavings > 0 && (
                    <div className="best-price-saving-text">
                      <FiAward style={{ marginRight: '4px' }} />
                      You save ₹{maxSavings.toLocaleString()} compared to highest price!
                    </div>
                  )}
                </div>

                <a
                  href={winnerPlatform?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="best-price-primary-cta"
                >
                  Buy Now on {winnerPlatform?.name} <FiExternalLink style={{ marginLeft: '6px' }} />
                </a>
              </div>
            ) : product.seller_info ? (
              <div className="seller-info-featured-card">
                <div className="seller-price-large">
                  ₹{product.price?.toLocaleString()}
                </div>
                <div className="seller-details-meta">
                  <div><strong>Store:</strong> {product.seller_info.storeName}</div>
                  <div><strong>Seller:</strong> {product.seller_info.sellerName}</div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Delivery & Pincode Checker Section */}
          <div className="details-delivery-section">
            <h3 className="section-subheading">
              <FiMapPin style={{ marginRight: '6px', color: '#2874f0' }} />
              Delivery & Services
            </h3>

            <form className="pincode-form" onSubmit={handlePincodeCheck}>
              <input
                type="text"
                placeholder="Enter 6-digit Pincode (e.g. 560001)"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value)}
                className="pincode-input"
              />
              <button type="submit" className="pincode-submit-btn">
                Check
              </button>
            </form>

            {pincodeMsg && <p className="pincode-error">{pincodeMsg}</p>}

            {deliveryInfo ? (
              <div className="delivery-results-box">
                <div className="delivery-result-row">
                  <FiCheckCircle className="deliv-ok-icon" />
                  <div>
                    <strong>Available for PIN {deliveryInfo.pincode}</strong>
                    <p>{deliveryInfo.expectedDate} • <span style={{ color: '#388e3c', fontWeight: 'bold' }}>FREE</span></p>
                  </div>
                </div>
                <div className="delivery-features-row">
                  <span>✔ Cash on Delivery Available</span>
                  <span>✔ {deliveryInfo.replacement}</span>
                  <span>✔ Real-time Order Tracking</span>
                </div>
              </div>
            ) : (
              <div className="delivery-default-perks">
                <span>🚚 Free standard delivery on all compared platforms</span>
                <span>🔄 7-day replacement guarantee</span>
                <span>🛡️ Safe & secure marketplace payment checkout</span>
              </div>
            )}
          </div>

          {/* Price Comparison Section */}
          <div className="details-comparison-section" id="compare-platforms-block">
            <h3 className="section-subheading">
              Live Platform Price Comparison
            </h3>

            {hasComparison ? (
              <PriceComparison
                amazon={product.amazon}
                meesho={product.meesho}
                flipkart={product.flipkart}
                inline={false}
              />
            ) : product.seller_info ? (
              <div className="custom-seller-product-box">
                <h4>Verified Crusent Merchant Listing</h4>
                <p>This item is listed directly by a verified seller on Crusent.</p>
                {product.specifications && (
                  <div className="specifications-text">
                    <strong>Specifications:</strong>
                    <p>{product.specifications}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Platform Ratings & Reviews Breakdown */}
          {hasComparison && (
            <div className="details-reviews-breakdown-card">
              <h3 className="section-subheading">Marketplace Ratings & Review Counts</h3>
              <div className="platform-reviews-grid">
                <div className="platform-review-box fk-box">
                  <div className="platform-review-top">
                    <span className="platform-name-tag" style={{ color: '#2874f0' }}>Flipkart</span>
                    <span className="rating-pill">{product.flipkart.rating} ★</span>
                  </div>
                  <div className="platform-review-stat">
                    {product.flipkart.reviewCount.toLocaleString()} Verified Reviews
                  </div>
                  <div className="platform-review-price">
                    Price: <strong>₹{product.flipkart.price.toLocaleString()}</strong>
                  </div>
                  <a
                    href={product.flipkart.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-read-link"
                  >
                    View on Flipkart &rarr;
                  </a>
                </div>

                <div className="platform-review-box amz-box">
                  <div className="platform-review-top">
                    <span className="platform-name-tag" style={{ color: '#ff9900' }}>Amazon</span>
                    <span className="rating-pill">{product.amazon.rating} ★</span>
                  </div>
                  <div className="platform-review-stat">
                    {product.amazon.reviewCount.toLocaleString()} Verified Reviews
                  </div>
                  <div className="platform-review-price">
                    Price: <strong>₹{product.amazon.price.toLocaleString()}</strong>
                  </div>
                  <a
                    href={product.amazon.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-read-link"
                  >
                    View on Amazon &rarr;
                  </a>
                </div>

                <div className="platform-review-box msh-box">
                  <div className="platform-review-top">
                    <span className="platform-name-tag" style={{ color: '#f43397' }}>Meesho</span>
                    <span className="rating-pill">{product.meesho.rating} ★</span>
                  </div>
                  <div className="platform-review-stat">
                    {product.meesho.reviewCount.toLocaleString()} Verified Reviews
                  </div>
                  <div className="platform-review-price">
                    Price: <strong>₹{product.meesho.price.toLocaleString()}</strong>
                  </div>
                  <a
                    href={product.meesho.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="platform-read-link"
                  >
                    View on Meesho &rarr;
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Crusent Seller CTA */}
          <div className="product-seller-cta-card">
            <div className="product-seller-cta-badge">CRUSENT SELLER HUB</div>
            <div className="product-seller-cta-content">
              <div>
                <h4>Have this product or similar items to sell?</h4>
                <p>Open a CRUSENT Seller Account to list your products, reach active buyers, and grow your sales.</p>
              </div>
              <div className="product-seller-cta-actions">
                {user && user.role === 'seller' ? (
                  <Link to="/seller/dashboard" className="product-seller-btn">
                    Seller Dashboard &rarr;
                  </Link>
                ) : (
                  <>
                    <Link to="/seller/register" className="product-seller-btn">
                      Open Seller Account
                    </Link>
                    <Link to="/seller/login" className="product-seller-btn-outline">
                      Seller Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-friendly Sticky Bottom Action Bar */}
      {hasComparison && winnerPlatform && (
        <aside className="mobile-sticky-action-bar" aria-label="Quick Purchase Actions">
          <div className="sticky-action-price-wrap">
            <span className="sticky-price-label">Best Price:</span>
            <div className="sticky-price-row">
              <span className="sticky-price-val">₹{minPrice?.toLocaleString()}</span>
              <span className="sticky-price-plat">on {winnerPlatform.name}</span>
            </div>
          </div>

          <div className="sticky-action-buttons">
            <button
              type="button"
              className="sticky-compare-btn"
              onClick={() => {
                const el = document.getElementById('compare-platforms-block');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Compare
            </button>
            <a
              href={winnerPlatform.url}
              target="_blank"
              rel="noreferrer"
              className="sticky-buy-btn"
            >
              Buy on {winnerPlatform.name} &rarr;
            </a>
          </div>
        </aside>
      )}
    </div>
  );
};

export default ProductDetails;
