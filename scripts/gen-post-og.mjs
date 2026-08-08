#!/usr/bin/env node
/**
 * gen-post-og.mjs — generate per-post Open Graph SVG cards (no sharp needed).
 *
 * Usage:
 *   npm run gen:og            # dry run
 *   npm run gen:og -- --write # write public/og/<slug>.svg
 *
 * Then set front-matter: cover: "/og/<slug>.svg"
 * (Many crawlers prefer PNG; SVG is the no-deps scaffold — swap later if needed.)
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const POSTS = join(ROOT, "src", "content", "posts");
const OUT = join(ROOT, "public", "og");
const write = process.argv.includes("--write");

function escXml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTitle(title, maxLen = 42) {
  const words = String(title).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxLen && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function buildSvg(title, slug) {
  const lines = wrapTitle(title);
  const text = lines
    .map(
      (line, i) =>
        `<text x="80" y="${280 + i * 56}" fill="#e5e7eb" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="44" font-weight="700">${escXml(line)}</text>`,
    )
    .join("\n  ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#05060a"/>
      <stop offset="100%" stop-color="#0a1628"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#34f5c5" stroke-opacity="0.35" stroke-width="2"/>
  <text x="80" y="120" fill="#34f5c5" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" letter-spacing="4">// DISPATCH · JPALM</text>
  ${text}
  <text x="80" y="540" fill="#6b7280" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20">${escXml(slug)}</text>
  <text x="80" y="575" fill="#9ca3af" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18">jasonwpalmer.com</text>
</svg>
`;
}

const files = readdirSync(POSTS).filter(
  (f) => f.endsWith(".mdx") && !f.startsWith("_"),
);

if (write && !existsSync(OUT)) mkdirSync(OUT, { recursive: true });

console.log(`[gen-post-og] ${files.length} post(s).`);
let written = 0;
for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  const raw = readFileSync(join(POSTS, file), "utf8");
  const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const title = titleMatch ? titleMatch[1] : slug;
  const dest = join(OUT, `${slug}.svg`);
  console.log(`  - ${slug}: "${title}" → ${dest}`);
  if (write) {
    writeFileSync(dest, buildSvg(title, slug), "utf8");
    written++;
  }
}

if (write) {
  console.log(`[gen-post-og] Wrote ${written} SVG(s) under public/og/.`);
  console.log(
    `[gen-post-og] Set cover: "/og/<slug>.svg" in front-matter (or keep /og.png fallback).`,
  );
} else {
  console.log("[gen-post-og] dry run. Pass --write to emit SVGs.");
}
process.exit(0);
