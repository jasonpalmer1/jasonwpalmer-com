// One-off brand asset generator: OG share card + favicon/app icons.
// Run with: node scripts/gen-brand-assets.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const C = {
  bg: "#05060a",
  panel: "#07080d",
  fg: "#f3f7ff",
  fgSoft: "#dce6ff",
  mint: "#34f5c5",
  sky: "#38bdf8",
  muted: "#8a93a8",
};

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="15%" cy="12%" r="55%">
      <stop offset="0%" stop-color="${C.mint}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${C.mint}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="88%" cy="92%" r="55%">
      <stop offset="0%" stop-color="${C.sky}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${C.sky}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0 H0 V48" fill="none" stroke="${C.mint}" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>

  <!-- HUD corner brackets -->
  <g stroke="${C.mint}" stroke-opacity="0.5" stroke-width="3" fill="none">
    <path d="M36 96 L36 36 L96 36"/>
    <path d="M1104 36 L1164 36 L1164 96"/>
    <path d="M36 534 L36 594 L96 594"/>
    <path d="M1104 594 L1164 594 L1164 534"/>
  </g>

  <!-- status chip -->
  <rect x="90" y="72" width="232" height="46" rx="23" fill="${C.mint}" fill-opacity="0.08" stroke="${C.mint}" stroke-opacity="0.4"/>
  <circle cx="118" cy="95" r="5" fill="${C.mint}"/>
  <text x="136" y="102" font-family="Menlo, monospace" font-size="20" fill="${C.mint}" letter-spacing="2">STATUS: ONLINE</text>

  <!-- name -->
  <text x="86" y="262" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="104" fill="${C.fg}" letter-spacing="-1">JASON PALMER</text>

  <!-- subtitle -->
  <text x="92" y="312" font-family="Menlo, monospace" font-size="27" fill="${C.mint}" letter-spacing="4">FINANCE OPERATOR  ×  SYSTEMS BUILDER</text>

  <!-- value pitch -->
  <text x="90" y="412" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="46" fill="${C.fgSoft}">I do the work of a finance team —</text>
  <text x="90" y="472" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="46" fill="${C.fgSoft}">then build the AI that does it in minutes.</text>

  <!-- divider + footer -->
  <rect x="90" y="540" width="1020" height="1" fill="${C.mint}" fill-opacity="0.15"/>
  <text x="90" y="578" font-family="Menlo, monospace" font-size="26" fill="${C.muted}">jasonwpalmer.com</text>
  <text x="1110" y="576" text-anchor="end" font-family="Menlo, monospace" font-size="22" fill="${C.sky}">CALLSIGN: JPALM</text>
</svg>`;

function iconSvg(size) {
  const s = size;
  const inset = s * 0.031;
  const r = s * 0.19;
  const stroke = s * 0.02;
  // Caps "JP" optically centered. Baseline tuned for Helvetica caps.
  const fontSize = s * 0.5;
  const baseline = s * 0.665;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs>
      <radialGradient id="ig" cx="50%" cy="32%" r="70%">
        <stop offset="0%" stop-color="${C.mint}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${C.mint}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="${inset}" y="${inset}" width="${s - 2 * inset}" height="${s - 2 * inset}" rx="${r}" fill="${C.panel}" stroke="${C.mint}" stroke-opacity="0.6" stroke-width="${stroke}"/>
    <rect x="${inset}" y="${inset}" width="${s - 2 * inset}" height="${s - 2 * inset}" rx="${r}" fill="url(#ig)"/>
    <text x="${s / 2}" y="${baseline}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="${fontSize}" fill="${C.mint}" letter-spacing="-${s * 0.012}">JP</text>
  </svg>`;
}

async function main() {
  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(ROOT, "public/og.png"));
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(ROOT, "src/app/icon.png"));
  await sharp(Buffer.from(iconSvg(180))).png().toFile(path.join(ROOT, "src/app/apple-icon.png"));
  // 256px PNG for PIL to turn into a multi-size favicon.ico
  await sharp(Buffer.from(iconSvg(256))).png().toFile("/tmp/jp-icon-256.png");
  console.log("Generated og.png, icon.png, apple-icon.png, /tmp/jp-icon-256.png");
}
main().catch((e) => { console.error(e); process.exit(1); });
