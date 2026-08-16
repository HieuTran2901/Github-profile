import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const assetsDir = path.join(__dirname, 'src', 'assets');

async function getDimensions() {
  for (const img of images) {
    const filePath = path.join(assetsDir, img);
    try {
      const stats = fs.statSync(filePath);
      // Let's just read first few bytes to get dimensions, or we can use a library
      console.log(`${img}: size = ${(stats.size / 1024).toFixed(2)} KB`);
    } catch (e) {
      console.log(`Error reading ${img}: ${e.message}`);
    }
  }
}

getDimensions();
