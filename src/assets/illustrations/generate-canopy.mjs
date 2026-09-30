/**
 * Generator for the original canopy illustration.
 * Run: node src/assets/illustrations/generate-canopy.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 1600;
const H = 960;
const f = (n) => Number(n.toFixed(2));

function rot(x, y, px, py, a) {
  return [x + px * Math.cos(a) - py * Math.sin(a), y + px * Math.sin(a) + py * Math.cos(a)];
}

function leaf(x, y, a, len, w) {
  const tip = rot(x, y, 0, -len, a);
  const rg = rot(x, y, w, -len * 0.38, a);
  const lf = rot(x, y, -w, -len * 0.38, a);
  return `M${f(x)},${f(y)} Q${f(rg[0])},${f(rg[1])} ${f(tip[0])},${f(tip[1])} Q${f(lf[0])},${f(lf[1])} ${f(x)},${f(y)}Z`;
}

function sampleCurve(x, y, mx, my, ex, ey, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * x + 2 * mt * t * mx + t * t * ex,
    y: mt * mt * y + 2 * mt * t * my + t * t * ey,
    ang:
      Math.atan2(
        2 * mt * (my - y) + 2 * t * (ey - my),
        2 * mt * (mx - x) + 2 * t * (ex - mx),
      ) + Math.PI / 2,
  };
}

function frond(x, y, a, length, scale, droop, colors, opacity = 1) {
  const mid = rot(x, y, droop, length * 0.5, a);
  const end = rot(x, y, droop * 1.85, length, a);
  const parts = [
    `<path d="M${f(x)},${f(y)} Q${f(mid[0])},${f(mid[1])} ${f(end[0])},${f(end[1])}" fill="none" stroke="${colors.rachis}" stroke-opacity="${0.5 * opacity}" stroke-width="${f(1.65 * scale)}" stroke-linecap="round"/>`,
  ];
  const n = 18;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 0.15);
    const p = sampleCurve(x, y, mid[0], mid[1], end[0], end[1], t);
    const size = (1 - t * 0.62) * 58 * scale;
    for (const side of [-1, 1]) {
      const la = p.ang + side * (1.05 - t * 0.28);
      parts.push(
        `<path d="${leaf(p.x, p.y, la, size, size * 0.44)}" fill="${side < 0 ? colors.a : colors.b}" fill-opacity="${f((0.28 + (1 - t) * 0.48) * opacity)}" stroke="${colors.rachis}" stroke-opacity="${0.16 * opacity}" stroke-width="0.45"/>`,
      );
    }
  }
  return parts.join('\n    ');
}

function vine(x, y, len, sway, w, color, op) {
  return `<path d="M${f(x)},${f(y)} C${f(x + sway * 0.18)},${f(y + len * 0.36)} ${f(x + sway * 1.1)},${f(y + len * 0.64)} ${f(x + sway)},${f(y + len)}" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
}

const teal = { a: '#7fd4c8', b: '#0f6e66', rachis: '#a8e3db' };
const deep = { a: '#1c3530', b: '#0b5751', rachis: '#7fd4c8' };
const sand = { a: '#c2b496', b: '#0f6e66', rachis: '#c2b496' };

const ferns = [];
const cx = 430;
const cy = 290;
const crown = [
  [-2.45, 210, 0.92, 14, deep, 0.5],
  [-2.1, 235, 0.98, 22, teal, 0.68],
  [-1.75, 255, 1.04, 30, teal, 0.82],
  [-1.4, 270, 1.1, 38, teal, 0.94],
  [-1.05, 278, 1.14, 46, teal, 1],
  [-0.7, 280, 1.16, 52, teal, 1],
  [-0.35, 272, 1.12, 56, teal, 0.96],
  [0.0, 255, 1.06, 58, teal, 0.88],
  [0.35, 232, 0.98, 54, sand, 0.74],
  [0.7, 205, 0.88, 48, deep, 0.52],
];
for (const [a, len, sc, droop, pal, op] of crown) {
  ferns.push(frond(cx, cy, a, len, sc, droop, pal, op));
}

ferns.push(
  `<path d="M${cx},${cy} C${cx - 4},380 ${cx + 6},470 ${cx - 2},560" fill="none" stroke="#13201d" stroke-width="9" stroke-linecap="round"/>`,
);
ferns.push(
  `<path d="M${cx},${cy} C${cx - 4},380 ${cx + 6},470 ${cx - 2},560" fill="none" stroke="#c2b496" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round"/>`,
);

ferns.push(frond(80, 640, 0.55, 230, 0.88, 24, teal, 0.9));
ferns.push(frond(30, 800, 0.28, 180, 0.72, 16, sand, 0.75));
ferns.push(frond(1540, 70, -0.72, 260, 0.95, -36, teal, 0.85));
ferns.push(frond(1480, 20, -1.05, 200, 0.78, -22, sand, 0.7));

const vines = [
  vine(160, -20, 380, 42, 1.35, '#7fd4c8', 0.28),
  vine(210, 10, 300, -28, 1.05, '#c2b496', 0.24),
  vine(720, -25, 340, 36, 1.2, '#a8e3db', 0.18),
  vine(980, -10, 300, -48, 1.1, '#c2b496', 0.2),
  vine(1240, -20, 360, 32, 1.3, '#7fd4c8', 0.2),
  vine(1460, 8, 260, -22, 1.0, '#c2b496', 0.18),
];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="none" role="img">
  <!-- Original illustration for Foresta Works. Botanical plate of a cloud-forest tree fern. -->
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.12" y2="1">
      <stop offset="0%" stop-color="#17302b"/>
      <stop offset="40%" stop-color="#101c19"/>
      <stop offset="100%" stop-color="#0c1614"/>
    </linearGradient>
    <radialGradient id="shaft" cx="62%" cy="28%" r="46%">
      <stop offset="0%" stop-color="#a8e3db" stop-opacity="0.2"/>
      <stop offset="40%" stop-color="#0f6e66" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#101c19" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow" cx="28%" cy="32%" r="34%">
      <stop offset="0%" stop-color="#0f6e66" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#101c19" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4f2ec" stop-opacity="0"/>
      <stop offset="52%" stop-color="#f4f2ec" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#f4f2ec" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c1614" stop-opacity="0.12"/>
      <stop offset="42%" stop-color="#0c1614" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0c1614" stop-opacity="0.62"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.04 0.016 0.05"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" mode="soft-light"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#shaft)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <ellipse cx="280" cy="220" rx="420" ry="260" fill="#13201d" fill-opacity="0.55"/>
  <ellipse cx="980" cy="200" rx="520" ry="280" fill="#0c1614" fill-opacity="0.4"/>
  <ellipse cx="1400" cy="360" rx="360" ry="240" fill="#17302b" fill-opacity="0.28"/>
  <ellipse cx="120" cy="760" rx="280" ry="180" fill="#13201d" fill-opacity="0.5"/>

  <g id="vines">${vines.join('\n    ')}</g>
  <g id="ferns">${ferns.join('\n    ')}</g>

  <rect y="310" width="${W}" height="240" fill="url(#fog)"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" fill="#101c19" opacity="0.42"/>
</svg>
`;

const out = join(dirname(fileURLToPath(import.meta.url)), 'canopy.svg');
writeFileSync(out, svg);
console.log(`Wrote ${out} (${svg.length} bytes)`);
