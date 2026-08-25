import { ChromeCapture } from './capture_cdp.js';

async function main() {
  const capturer = new ChromeCapture();
  await capturer.start();
  await capturer.capture('https://example.com', 'src/assets/projects/test_sample.png', 1000);
  await capturer.close();
  console.log('Capture test succeeded!');
}

main().catch(err => {
  console.error('Error during capture test:', err);
  process.exit(1);
});
