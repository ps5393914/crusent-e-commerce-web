import { FiExternalLink, FiCheckCircle, FiStar, FiAward, FiTrendingDown } from 'react-icons/fi';

const PriceComparison = ({ amazon, meesho, flipkart, inline = false }) => {
  if (!amazon || !meesho || !flipkart) return null;

  const platforms = [
    {
      id: 'flipkart',
      name: 'Flipkart',
      price: flipkart.price,
      url: flipkart.productUrl,
      rating: flipkart.rating,
      reviewCount: flipkart.reviewCount,
      brandColor: '#2874f0',
      badgeBg: '#e8f0fe',
      btnClass: 'flipkart-buy-btn',
      delivery: 'Free Delivery • 2-3 Days',
      tag: 'Official Partner'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      price: amazon.price,
      url: amazon.productUrl,
      rating: amazon.rating,
      reviewCount: amazon.reviewCount,
      brandColor: '#ff9900',
      badgeBg: '#fff3e0',
      btnClass: 'amazon-buy-btn',
      delivery: 'Fast Delivery • Prime Eligible',
      tag: 'Top Rated'
    },
    {
      id: 'meesho',
      name: 'Meesho',
      price: meesho.price,
      url: meesho.productUrl,
      rating: meesho.rating,
      reviewCount: meesho.reviewCount,
      brandColor: '#f43397',
      badgeBg: '#fce4ec',
      btnClass: 'meesho-buy-btn',
      delivery: 'Free Delivery • Standard',
      tag: 'Best Value'
    }
  ];

  const minPrice = Math.min(...platforms.map((p) => p.price));
  const maxPrice = Math.max(...platforms.map((p) => p.price));
  const maxSavings = maxPrice - minPrice;
  const winner = platforms.find((p) => p.price === minPrice);

  if (inline) {
    return (
      <div className="price-comparison-inline">
        <div className="pc-inline-header">
          <span className="pc-best-price-label">Best Price:</span>
          <span className="pc-best-price-value">₹{minPrice.toLocaleString()}</span>
          {winner && (
            <span className="pc-winner-badge">
              <FiAward style={{ marginRight: '3px' }} /> On {winner.name}
            </span>
          )}
        </div>

        <div className="pc-inline-chips">
          {platforms.map((p) => {
            const isWinner = p.price === minPrice;
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={`pc-inline-chip ${isWinner ? 'chip-winner' : ''}`}
                title={`Buy on ${p.name} for ₹${p.price.toLocaleString()}`}
              >
                <span className="pc-chip-name" style={{ color: p.brandColor }}>
                  {p.name}
                </span>
                <span className="pc-chip-price">₹{p.price.toLocaleString()}</span>
                {isWinner && <span className="pc-chip-star">★ Best</span>}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="price-comparison-full">
      {/* Winner Highlight Box */}
      <div className="pc-winner-banner">
        <div className="pc-winner-banner-left">
          <div className="pc-winner-icon-wrap">
            <FiAward />
          </div>
          <div>
            <div className="pc-winner-title">
              Best Price on <strong>{winner?.name}</strong>: ₹{minPrice.toLocaleString()}
            </div>
            {maxSavings > 0 && (
              <div className="pc-winner-savings">
                <FiTrendingDown style={{ marginRight: '4px' }} />
                Save ₹{maxSavings.toLocaleString()} compared to other marketplaces!
              </div>
            )}
          </div>
        </div>

        {winner && (
          <a
            href={winner.url}
            target="_blank"
            rel="noreferrer"
            className={`pc-banner-cta ${winner.btnClass}`}
          >
            Buy on {winner.name} <FiExternalLink style={{ marginLeft: '6px' }} />
          </a>
        )}
      </div>

      {/* Modern Marketplace Cards Grid */}
      <div className="pc-cards-grid">
        {platforms.map((p) => {
          const isWinner = p.price === minPrice;
          const diffFromMin = p.price - minPrice;

          return (
            <div
              key={p.id}
              className={`pc-seller-card ${isWinner ? 'is-winner' : ''}`}
            >
              {isWinner && (
                <div className="pc-seller-badge-top">
                  <FiAward /> LOWEST PRICE
                </div>
              )}

              <div className="pc-seller-header">
                <div className="pc-seller-brand">
                  <span
                    className="pc-seller-dot"
                    style={{ backgroundColor: p.brandColor }}
                  ></span>
                  <span className="pc-seller-name" style={{ color: p.brandColor }}>
                    {p.name}
                  </span>
                </div>
                <span className="pc-seller-tag" style={{ background: p.badgeBg, color: p.brandColor }}>
                  {p.tag}
                </span>
              </div>

              <div className="pc-seller-price-wrap">
                <div className="pc-seller-price">₹{p.price.toLocaleString()}</div>
                {diffFromMin > 0 ? (
                  <div className="pc-seller-diff">+₹{diffFromMin.toLocaleString()}</div>
                ) : (
                  <div className="pc-seller-cheapest">Lowest Offer</div>
                )}
              </div>

              <div className="pc-seller-meta">
                <div className="pc-seller-rating">
                  <span className="rating-pill">
                    {p.rating} <FiStar className="star-icon" />
                  </span>
                  <span className="review-count">
                    {p.reviewCount.toLocaleString()} reviews
                  </span>
                </div>

                <div className="pc-seller-delivery">
                  <FiCheckCircle className="check-icon" />
                  <span>{p.delivery}</span>
                </div>
              </div>

              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={`pc-buy-btn ${p.btnClass}`}
              >
                Buy on {p.name} <FiExternalLink style={{ marginLeft: '6px' }} />
              </a>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix Table for Desktop */}
      <div className="pc-table-wrapper">
        <table className="pc-matrix-table">
          <thead>
            <tr>
              <th>Marketplace</th>
              <th>Live Price</th>
              <th>Rating & Reviews</th>
              <th>Availability</th>
              <th>Savings</th>
              <th>Buy Now</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p) => {
              const isWinner = p.price === minPrice;
              const diffFromMin = p.price - minPrice;
              return (
                <tr key={p.id} className={isWinner ? 'row-winner' : ''}>
                  <td className="col-platform">
                    <span className="platform-name" style={{ color: p.brandColor }}>
                      {p.name}
                    </span>
                    {isWinner && <span className="winner-pill">Best Deal</span>}
                  </td>
                  <td className="col-price">
                    <span className="price-bold">₹{p.price.toLocaleString()}</span>
                  </td>
                  <td className="col-rating">
                    <div className="rating-inline">
                      <span className="rating-pill">
                        {p.rating} <FiStar className="star-icon" />
                      </span>
                      <span className="reviews-text">
                        ({p.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </td>
                  <td className="col-delivery">
                    <span className="in-stock-badge">In Stock</span>
                    <small>{p.delivery}</small>
                  </td>
                  <td className="col-savings">
                    {diffFromMin === 0 ? (
                      <span className="savings-highlight">Best Value</span>
                    ) : (
                      <span className="savings-diff">+₹{diffFromMin.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="col-action">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`pc-buy-btn-sm ${p.btnClass}`}
                    >
                      Buy Now &rarr;
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceComparison;
