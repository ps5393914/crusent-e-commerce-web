import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiTrendingDown, FiShield } from 'react-icons/fi';
import { WishlistContext } from '../context/WishlistContext';
import PriceComparison from './PriceComparison';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const isFavorited = isInWishlist(product.id);

  // If standard comparison product (Flipkart, Amazon, Meesho)
  const hasComparison = product.amazon && product.meesho && product.flipkart;
  let minPrice = null;
  let maxPrice = null;
  let bestSeller = null;
  let discountPercent = null;
  let avgRating = 4.5;
  let totalReviews = 0;

  if (hasComparison) {
    const list = [
      { name: 'Amazon', price: product.amazon.price, rating: product.amazon.rating, reviews: product.amazon.reviewCount },
      { name: 'Flipkart', price: product.flipkart.price, rating: product.flipkart.rating, reviews: product.flipkart.reviewCount },
      { name: 'Meesho', price: product.meesho.price, rating: product.meesho.rating, reviews: product.meesho.reviewCount }
    ];

    minPrice = Math.min(...list.map((i) => i.price));
    maxPrice = Math.max(...list.map((i) => i.price));
    bestSeller = list.find((i) => i.price === minPrice)?.name;

    if (maxPrice > minPrice) {
      discountPercent = Math.round(((maxPrice - minPrice) / maxPrice) * 100);
    }
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

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="modern-product-card" data-product-id={product.id}>
      {/* Top Card Badges & Wishlist Button */}
      <div className="product-card-top-bar">
        {hasComparison && discountPercent > 0 ? (
          <span className="product-discount-badge">
            <FiTrendingDown style={{ marginRight: '3px' }} />
            Save {discountPercent}% on {bestSeller}
          </span>
        ) : product.seller_info ? (
          <span className="product-seller-badge">
            <FiShield style={{ marginRight: '3px' }} />
            Verified Store
          </span>
        ) : (
          <span className="product-best-badge">Best Comparison</span>
        )}

        <button
          type="button"
          className={`product-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <FiHeart className="wishlist-icon" />
        </button>
      </div>

      {/* Product Image & Link */}
      <Link to={`/product/${product.id}`} className="product-card-image-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="modern-product-image"
            loading="lazy"
          />
        </div>

        <div className="product-card-body">
          <span className="product-card-category">{product.category}</span>
          <h3 className="modern-product-title" title={product.name}>
            {product.name}
          </h3>

          {/* Rating Pill */}
          <div className="product-rating-row">
            <span className="rating-pill">
              {avgRating} <FiStar className="star-icon" />
            </span>
            <span className="rating-count-text">
              ({totalReviews > 0 ? `${totalReviews.toLocaleString()} reviews` : 'Verified'})
            </span>
          </div>

          <p className="modern-product-desc">{product.description}</p>
        </div>
      </Link>

      {/* Price Comparison / Seller Section */}
      <div className="product-card-pricing-section">
        {product.seller_info ? (
          <div className="seller-product-price-box">
            <div className="seller-product-price">
              ₹{product.price?.toLocaleString()}
            </div>
            <div className="seller-product-store">
              Sold by: <strong>{product.seller_info.storeName}</strong>
            </div>
            <Link to={`/product/${product.id}`} className="view-deal-btn">
              View Product Details
            </Link>
          </div>
        ) : hasComparison ? (
          <div className="comparison-preview-wrap">
            <PriceComparison
              amazon={product.amazon}
              meesho={product.meesho}
              flipkart={product.flipkart}
              inline={true}
            />
            <div className="product-card-actions">
              <Link to={`/product/${product.id}`} className="view-deal-btn">
                Compare All 3 Sellers &rarr;
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Seller Hub Footer Link */}
      <div className="product-card-footer">
        <span className="footer-subtext">Have this item to sell?</span>
        <Link to="/seller/login" className="footer-seller-link">
          Sell on Crusent &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
