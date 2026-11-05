// Generates the PWA icons from the hero "network of nodes" motif.
// Run with: npm run icons   (writes into public/icons)
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const edges = [
  [300, 40, 360, 100], [360, 100, 320, 170], [320, 170, 240, 130], [240, 130, 300, 40],
  [240, 130, 170, 80], [170, 80, 300, 40], [320, 170, 370, 250], [240, 130, 260, 230],
  [260, 230, 320, 170], [170, 80, 110, 150], [110, 150, 240, 130],
];
const teal = [[360, 100], [320, 170], [170, 80], [370, 250], [260, 230], [110, 150]];
const ochre = [[300, 40], [240, 130]];

/** scale: share of the canvas the motif may use (smaller for maskable safe zone). */
function svg(size, scale, rounded) {
  const k = (size * scale) / 260; // motif is 260 wide, 210 tall
  const ox = size / 2 - 240 * k;
  const oy = size / 2 - 145 * k;
  const X = (x) => (ox + x * k).toFixed(1);
  const Y = (y) => (oy + y * k).toFixed(1);
  const sw = Math.max(1.5, 3.2 * k);
  const r = rounded ? size * 0.22 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" rx="${r}" fill="#0A2540"/>
<g stroke="#2F6F8F" stroke-width="${sw}" stroke-linecap="round" fill="none">${edges
    .map(([a, b, c, d]) => `<path d="M${X(a)} ${Y(b)} L${X(c)} ${Y(d)}"/>`)
    .join('')}</g>
<g fill="#5FB3C4">${teal.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${(8 * k).toFixed(1)}"/>`).join('')}</g>
<g fill="#E8A33D">${ochre.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${(12 * k).toFixed(1)}"/>`).join('')}</g>
</svg>`;
}

await mkdir('public/icons', { recursive: true });
const out = [
  ['icon-192.png', 192, 0.72, false],
  ['icon-512.png', 512, 0.72, false],
  ['icon-maskable-512.png', 512, 0.56, false],
  ['apple-touch-icon.png', 180, 0.66, false],
];
for (const [name, size, scale, rounded] of out) {
  await sharp(Buffer.from(svg(size, scale, rounded))).png().toFile(`public/icons/${name}`);
}
await writeFile('public/icons/favicon.svg', svg(64, 0.8, true));
console.log('icons written');
