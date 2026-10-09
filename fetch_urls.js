const fs = require('fs');
const https = require('https');

const queries = [
  "Apple iPhone 15 128gb black",
  "Sony WH-1000XM5",
  "Apple Watch Series 9",
  "HP Pavilion 14",
  "JBL Charge 5",
  "Puma Mens Sneakers",
  "American Tourister Backpack",
  "Logitech G502",
  "Philips Air Fryer HD9200",
  "Fastrack Mens Watch"
];

const fetchFlipkartUrl = (query) => {
  return new Promise((resolve, reject) => {
    const url = 'https://www.flipkart.com/search?q=' + encodeURIComponent(query);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // regex to find the first /p/itm... link
        const match = data.match(/href="(\/[a-zA-Z0-9-]+\/p\/itm[a-zA-Z0-9]+)\?pid=/);
        if (match) {
          resolve('https://www.flipkart.com' + match[1]);
        } else {
          resolve('https://www.flipkart.com/search?q=' + encodeURIComponent(query));
        }
      });
    }).on('error', reject);
  });
};

async function run() {
  const products = require('./backend/data/products.json');
  for (let i = 0; i < products.length; i++) {
    const query = queries[i];
    const url = await fetchFlipkartUrl(query);
    console.log(`Product ${i+1} URL: ${url}`);
    products[i].flipkart.productUrl = url;
  }
  fs.writeFileSync('./backend/data/products.json', JSON.stringify(products, null, 2));
  console.log("Updated products.json with real URLs!");
}

run();
