import puppeteer from 'puppeteer-core';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, 'index-2026.html');
const outPath = resolve(__dirname, 'durgotsav-2026.pdf');

// A4 at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: A4_WIDTH_PX, height: A4_HEIGHT_PX });
await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

const contentHeight = await page.evaluate(() => document.documentElement.scrollHeight);

// Scale down just enough so everything fits in one A4 page
const scale = Math.min(1, A4_HEIGHT_PX / contentHeight);
console.log(`Content height: ${contentHeight}px, scale: ${scale.toFixed(3)}`);

await page.pdf({
  path: outPath,
  format: 'A4',
  scale,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

await browser.close();
console.log(`PDF saved to: ${outPath}`);
