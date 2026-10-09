import React from 'react';

const PriceComparison = ({ amazon, meesho, flipkart, inline = false }) => {
  // Determine winner based on price
  const prices = [
    { name: 'Amazon', price: amazon.price, url: amazon.productUrl, rating: amazon.rating, reviewCount: amazon.reviewCount },
    { name: 'Meesho', price: meesho.price, url: meesho.productUrl, rating: meesho.rating, reviewCount: meesho.reviewCount },
    { name: 'Flipkart', price: flipkart.price, url: flipkart.productUrl, rating: flipkart.rating, reviewCount: flipkart.reviewCount }
  ];

  const minPrice = Math.min(...prices.map(p => p.price));
  const winners = prices.filter(p => p.price === minPrice);
  const bestPriceString = winners.map(w => `${w.name} - ₹${w.price.toLocaleString()}`).join(' / ');

  return (
    <div style={{ marginTop: '15px' }}>
      {!inline && (
        <div style={{ marginBottom: '10px', backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '4px', border: '1px solid #4caf50', color: '#2e7d32', fontWeight: 'bold' }}>
          Best Price: {bestPriceString}
        </div>
      )}
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Reviews</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className={amazon.price === minPrice ? 'winner' : ''}>
            <td>Amazon</td>
            <td>₹{amazon.price.toLocaleString()}</td>
            <td>{amazon.rating}★</td>
            <td>{amazon.reviewCount.toLocaleString()} Reviews</td>
            <td>
              <a href={amazon.productUrl} target="_blank" rel="noreferrer" className="buy-now-btn amazon-btn">Buy Now</a>
            </td>
          </tr>
          <tr className={flipkart.price === minPrice ? 'winner' : ''}>
            <td>Flipkart</td>
            <td>₹{flipkart.price.toLocaleString()}</td>
            <td>{flipkart.rating}★</td>
            <td>{flipkart.reviewCount.toLocaleString()} Reviews</td>
            <td>
              <a href={flipkart.productUrl} target="_blank" rel="noreferrer" className="buy-now-btn flipkart-btn">Buy Now</a>
            </td>
          </tr>
          <tr className={meesho.price === minPrice ? 'winner' : ''}>
            <td>Meesho</td>
            <td>₹{meesho.price.toLocaleString()}</td>
            <td>{meesho.rating}★</td>
            <td>{meesho.reviewCount.toLocaleString()} Reviews</td>
            <td>
              <a href={meesho.productUrl} target="_blank" rel="noreferrer" className="buy-now-btn meesho-btn">Buy Now</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PriceComparison;
