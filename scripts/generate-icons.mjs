/**
 * Generates all GlowUp app icon assets from SVG.
 * Run: node scripts/generate-icons.mjs
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, '../assets');

const TERRA  = '#E07856';
const CREAM  = '#FFF5EE';
const BROWN  = '#2D1810';

const FONT_PATH = resolve(__dirname,
  '../node_modules/@expo-google-fonts/fraunces/700Bold/Fraunces_700Bold.ttf');
const FONT_BOLD = readFileSync(FONT_PATH);

// ── Sparkle mark (4-pointed star / ✦ shape)
// Uses quadratic bezier curves where the control points sit INSIDE the figure
// (between the center and the diagonal midpoints) to create the characteristic
// concave sides of a sparkle. r controls how deeply pinched the sides are —
// lower r = tighter pinch = more star-like.
function sparklePath(cx = 512, cy = 512, R = 240, r = 65) {
  const [T, Rt, B, L] = [
    [cx,    cy-R], // top tip
    [cx+R,  cy  ], // right tip
    [cx,    cy+R], // bottom tip
    [cx-R,  cy  ], // left tip
  ];
  // Control points: each sits in a diagonal quadrant, close to center,
  // creating concave (inward-curving) sides between tips.
  const [tr, br, bl, tl] = [
    [cx+r, cy-r], // top-right control
    [cx+r, cy+r], // bottom-right control
    [cx-r, cy+r], // bottom-left control
    [cx-r, cy-r], // top-left control
  ];
  return [
    `M ${T[0]},${T[1]}`,
    `Q ${tr[0]},${tr[1]} ${Rt[0]},${Rt[1]}`,
    `Q ${br[0]},${br[1]} ${B[0]},${B[1]}`,
    `Q ${bl[0]},${bl[1]} ${L[0]},${L[1]}`,
    `Q ${tl[0]},${tl[1]} ${T[0]},${T[1]}`,
    'Z',
  ].join(' ');
}

// Tiny accent circle — floats above the top-right side of the sparkle
function dotPath(cx = 512, cy = 512, R = 240, r = 28) {
  // Position just outside the sparkle along the top-right diagonal
  const dist = R * 0.62;
  const x = cx + dist * Math.cos(-Math.PI / 4);  // 45° top-right
  const y = cy + dist * Math.sin(-Math.PI / 4);
  return `M ${x - r},${y} a ${r},${r} 0 1,0 ${r*2},0 a ${r},${r} 0 1,0 -${r*2},0`;
}

// ── SVG builders ────────────────────────────────────────────────────────────

// ── Wordmark icon (like Blinkit / District)
// "Glow" on line 1, "Up" on line 2 (right-aligned to match)
// with a small ✦ sparkle accent top-right

function buildFullIcon(size = 1024) {
  const sp = sparklePath(820, 210, 52, 14); // small sparkle top-right
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${TERRA}"/>
  <!-- "Glow" line -->
  <text
    x="512" y="510"
    font-family="Fraunces" font-weight="700" font-size="310"
    fill="${CREAM}"
    text-anchor="middle" dominant-baseline="auto"
    letter-spacing="-4"
  >Glow</text>
  <!-- "Up" line — slightly smaller, centered under Glow -->
  <text
    x="512" y="760"
    font-family="Fraunces" font-weight="700" font-size="240"
    fill="${CREAM}"
    text-anchor="middle" dominant-baseline="auto"
    letter-spacing="-2"
    opacity="0.92"
  >Up</text>
  <!-- sparkle accent -->
  <path d="${sp}" fill="${CREAM}" opacity="0.7"/>
</svg>`;
}

function buildForeground(size = 1024) {
  // Transparent bg for Android adaptive — cream wordmark
  const sp = sparklePath(820, 210, 52, 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <text
    x="512" y="510"
    font-family="Fraunces" font-weight="700" font-size="310"
    fill="${CREAM}"
    text-anchor="middle" dominant-baseline="auto"
    letter-spacing="-4"
  >Glow</text>
  <text
    x="512" y="760"
    font-family="Fraunces" font-weight="700" font-size="240"
    fill="${CREAM}"
    text-anchor="middle" dominant-baseline="auto"
    letter-spacing="-2"
    opacity="0.92"
  >Up</text>
  <path d="${sp}" fill="${CREAM}" opacity="0.7"/>
</svg>`;
}

function buildBackground(size = 1024) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${TERRA}"/>
</svg>`;
}

function buildMonochrome(size = 1024) {
  // White wordmark on transparent for Android themed tinting
  const sp = sparklePath(820, 210, 52, 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <text
    x="512" y="510"
    font-family="Fraunces" font-weight="700" font-size="310"
    fill="white"
    text-anchor="middle" dominant-baseline="auto"
    letter-spacing="-4"
  >Glow</text>
  <text
    x="512" y="760"
    font-family="Fraunces" font-weight="700" font-size="240"
    fill="white"
    text-anchor="middle" dominant-baseline="auto"
    letter-spacing="-2"
    opacity="0.85"
  >Up</text>
  <path d="${sp}" fill="white" opacity="0.6"/>
</svg>`;
}

function buildFavicon(size = 64) {
  // At 64px text becomes tiny — use just the sparkle mark
  const s = sparklePath(32, 32, 15, 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${TERRA}"/>
  <path d="${s}" fill="${CREAM}"/>
</svg>`;
}

function buildSplashIcon(size = 200) {
  // Splash overlay — cream sparkle on transparent (bg is terracotta via app.json)
  const s = sparklePath(100, 100, 48, 13);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200">
  <path d="${s}" fill="${CREAM}"/>
</svg>`;
}

// ── Render & save ────────────────────────────────────────────────────────────

function render(svg, outPath, useFont = false) {
  const opts = { fitTo: { mode: 'original' } };
  if (useFont) {
    opts.font = {
      loadSystemFonts: false,
      fontBuffers: [FONT_BOLD],
      defaultFontFamily: 'Fraunces',
    };
  }
  const resvg = new Resvg(svg, opts);
  const pngData = resvg.render();
  const png = pngData.asPng();
  writeFileSync(outPath, png);
  console.log(`✓  ${outPath.replace(process.cwd(), '.')}`);
}

// ── Active variant: wordmark ─────────────────────────────────────────────────
render(buildFullIcon(1024),     resolve(ASSETS, 'icon.png'),                        true);
render(buildForeground(1024),   resolve(ASSETS, 'android-icon-foreground.png'),   true);
render(buildBackground(1024),   resolve(ASSETS, 'android-icon-background.png'),   false);
render(buildMonochrome(1024),   resolve(ASSETS, 'android-icon-monochrome.png'),   true);
render(buildFavicon(64),        resolve(ASSETS, 'favicon.png'),                    false);
render(buildSplashIcon(200),    resolve(ASSETS, 'splash-icon.png'),                false);

// ── Archived variant: sparkle mark ──────────────────────────────────────────
// Saved to assets/variants/sparkle-mark/ for reference.
function buildSparkleIcon(size = 1024) {
  const s = sparklePath(512, 512, 240, 65);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${TERRA}"/>
  <circle cx="512" cy="512" r="315" fill="none" stroke="${CREAM}" stroke-width="5" opacity="0.2"/>
  <path d="${s}" fill="${CREAM}"/>
  <circle cx="${512 + 240*0.62*Math.cos(-Math.PI/4)}" cy="${512 + 240*0.62*Math.sin(-Math.PI/4)}" r="28" fill="${CREAM}" opacity="0.55"/>
</svg>`;
}
function buildSparkleForeground(size = 1024) {
  const s = sparklePath(512, 512, 210, 57);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <circle cx="512" cy="512" r="275" fill="none" stroke="${CREAM}" stroke-width="5" opacity="0.25"/>
  <path d="${s}" fill="${CREAM}"/>
  <circle cx="${512 + 210*0.62*Math.cos(-Math.PI/4)}" cy="${512 + 210*0.62*Math.sin(-Math.PI/4)}" r="24" fill="${CREAM}" opacity="0.6"/>
</svg>`;
}

const VARIANTS = resolve(ASSETS, 'variants/sparkle-mark');
render(buildSparkleIcon(1024),      resolve(VARIANTS, 'icon.png'),                       false);
render(buildSparkleForeground(1024),resolve(VARIANTS, 'android-icon-foreground.png'),    false);
render(buildBackground(1024),       resolve(VARIANTS, 'android-icon-background.png'),    false);

console.log('\nAll icon assets generated.');
