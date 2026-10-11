import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiTrendingDown, FiShield, FiZap, FiShoppingBag } from 'react-icons/fi';

const BANNERS = [
  {
    id: 1,
    badge: 'MEGA PRICE DROP FEST',
    title: 'Compare & Save Big on Top Smartphones',
    subtitle: 'Live price comparison across Flipkart, Amazon & Meesho. Save up to ₹3,500 on iPhone 15 & flagships!',
    ctaText: 'Compare Mobiles Now',
    category: 'Smartphones',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 60%, #2874f0 100%)',
    accentColor: '#ffe500',
    icon: <FiZap />
  },
  {
    id: 2,
    badge: 'LOWEST PRICE GUARANTEE',
    title: 'Sony & JBL Premium Audio Bonanza',
    subtitle: 'Verified marketplace ratings and reviews. Industry-leading noise canceling headphones at unbeatable prices.',
    ctaText: 'Explore Audio Deals',
    category: 'Headphones',
    gradient: 'linear-gradient(135deg, #093028 0%, #237a57 60%, #2ecc71 100%)',
    accentColor: '#a8ff78',
    icon: <FiTrendingDown />
  },
  {
    id: 3,
    badge: 'TRENDING IN TECH & GAMING',
    title: 'PlayStation 5, Laptops & Smart Gadgets',
    subtitle: 'Direct authentic Buy Now links to official marketplace sellers. Never pay more than you should.',
    ctaText: 'View Tech Deals',
    category: 'Gaming Consoles',
    gradient: 'linear-gradient(135deg, #4b1248 0%, #f0c27b 100%)',
    accentColor: '#ffed4a',
    icon: <FiShoppingBag />
  },
  {
    id: 4,
    badge: 'CRUSENT SELLER COMMUNITY',
    title: 'Sell Your Products on Crusent Hub',
    subtitle: '0% Setup Fee • Direct buyers • Verified merchant badge • Easy catalog management for online sellers.',
    ctaText: 'Open Seller Account',
    link: '/seller/register',
    gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 70%, #ff9f00 100%)',
    accentColor: '#ff9f00',
    icon: <FiShield />
  }
];

const BannerCarousel = ({ onSelectCategory, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const banner = BANNERS[currentIndex];

  const handleBannerAction = () => {
    if (banner.link && onNavigate) {
      onNavigate(banner.link);
    } else if (banner.category && onSelectCategory) {
      onSelectCategory(banner.category);
    }
  };

  return (
    <div className="banner-carousel-container" aria-label="Deals and promotional offers carousel">
      <div 
        className="banner-slide"
        style={{ background: banner.gradient }}
        onClick={handleBannerAction}
        role="button"
        tabIndex={0}
      >
        <div className="banner-slide-content">
          <div className="banner-badge-row">
            <span className="banner-badge" style={{ borderColor: banner.accentColor, color: banner.accentColor }}>
              {banner.icon} {banner.badge}
            </span>
            <span className="banner-live-tag">🔴 LIVE COMPARISON</span>
          </div>

          <h2 className="banner-title">{banner.title}</h2>
          <p className="banner-subtitle">{banner.subtitle}</p>

          <div className="banner-cta-row">
            <button className="banner-cta-btn" onClick={handleBannerAction}>
              {banner.ctaText} &rarr;
            </button>
            <span className="banner-marketplaces-label">
              Flipkart • Amazon • Meesho
            </span>
          </div>
        </div>

        <div className="banner-decor-art">
          <div className="banner-decor-circle" style={{ borderColor: banner.accentColor }}></div>
          <div className="banner-decor-symbol">{banner.icon}</div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        className="banner-arrow-btn banner-arrow-left" 
        onClick={handlePrev} 
        aria-label="Previous banner"
      >
        <FiChevronLeft />
      </button>
      <button 
        className="banner-arrow-btn banner-arrow-right" 
        onClick={handleNext} 
        aria-label="Next banner"
      >
        <FiChevronRight />
      </button>

      {/* Dots Indicator */}
      <div className="banner-dots">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
