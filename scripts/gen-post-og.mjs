#!/usr/bin/env node
/**
 * gen-post-og.mjs — STUB scaffold for per-post Open Graph images.
 *
 * Intended flow (Claude / local finish):
 *   1. Read posts from src/content/posts/*.mdx (skip _*)
 *   2. Render a 1200×630 branded card (title + callsign) → public/og/<slug>.png
 *   3. Optionally patch front-matter with cover: "/og/<slug>.png"
 *
 * This stub only lists posts and prints the target paths so the pipeline is
 * discoverable. Implement rendering with sharp / @vercel/og / puppeteer as preferred.
 *
 * Usage: node scripts/gen-post-og.mjs [--write]
 */

import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const POSTS = join(ROOT, "src", "content", "posts");
const OUT = join(ROOT, "public", "og");
const write = process.argv.includes("--write");

const files = readdirSync(POSTS).filter(
  (f) => f.endsWith(".mdx") && !f.startsWith("_"),
);

if (write && !existsSync(OUT)) mkdirSync(OUT, { recursive: true });

console.log(`[gen-post-og] ${files.length} post(s). Stub — no images written yet.`);
for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  const raw = readFileSync(join(POSTS, file), "utf8");
  const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const title = titleMatch ? titleMatch[1] : slug;
  const dest = join(OUT, `${slug}.png`);
  console.log(`  - ${slug}: "${title}" → ${dest}`);
}

console.log(
  write
    ? "[gen-post-og] --write set, but renderer not implemented. See docs/feature-scaffolds/per-post-og.md"
    : "[gen-post-og] dry run. Pass --write after implementing the renderer.",
);
process.exit(write ? 1 : 0);
