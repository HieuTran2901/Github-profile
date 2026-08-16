const fs = require('fs');

const images = [
  'tiktok_ui.png',
  'tiktok_ui1.png',
  'tiktok_ui2.png',
  'shop.jpg',
  'shop1.jpg',
  'transport.jpg',
  'transport1.jpg',
  'transport2.jpg',
  'finance.jpg',
  'travel.JPG',
  'travel1.JPG',
  'travel2.JPG'
];

try {
  const sizeOf = require('image-size');
  for (const img of images) {
    try {
      const dim = sizeOf('src/assets/' + img);
      console.log(`${img}: ${dim.width}x${dim.height} (${dim.type})`);
    } catch(e) {
      console.log(`${img}: ERROR - ${e.message}`);
    }
  }
} catch (err) {
  console.log("image-size not found");
}
