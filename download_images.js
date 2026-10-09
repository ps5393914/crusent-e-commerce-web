const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', file: 'smartphone.jpg' },
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', file: 'headphones.jpg' },
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', file: 'smartwatch.jpg' },
  { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', file: 'laptop.jpg' },
  { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', file: 'speaker.jpg' },
  { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', file: 'shoes.jpg' },
  { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', file: 'backpack.jpg' },
  { url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80', file: 'appliance.jpg' },
  { url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80', file: 'accessory.jpg' },
  { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80', file: 'console.jpg' },
  { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80', file: 'tv.jpg' }
];

const dir = path.join(__dirname, 'frontend/public/images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

images.forEach(img => {
  const filePath = path.join(dir, img.file);
  const file = fs.createWriteStream(filePath);
  https.get(img.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${img.file}`);
    });
  });
});
