#!/usr/bin/env node
/**
 * Fail if gallery srcs or post cover paths are missing under public/.
 * Claude / CI: node scripts/check-build-assets.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toolsPath = join(root, "src/data/tools.ts");
const postsDir = join(root, "src/content/posts");

const toolsSrc = readFileSync(toolsPath, "utf8");
const galleryPaths = [...toolsSrc.matchAll(/src:\s*"(\/builds\/[^"]+)"/g)].map(
  (m) => m[1],
);

const coverPaths = [];
for (const file of readdirSync(postsDir)) {
  if (!file.endsWith(".mdx") || file.startsWith("_")) continue;
  const raw = readFileSync(join(postsDir, file), "utf8");
  const m = raw.match(/^cover:\s*["']?(\/[^"'\s]+)["']?\s*$/m);
  if (m) coverPaths.push(m[1]);
}

const all = [...galleryPaths, ...coverPaths];
const missing = all.filter((p) => !existsSync(join(root, "public", p.slice(1))));

if (missing.length) {
  console.error("[check-build-assets] Missing files:");
  for (const p of missing) console.error("  ", p);
  process.exit(1);
}
console.log(
  `[check-build-assets] OK — ${galleryPaths.length} gallery + ${coverPaths.length} cover asset(s).`,
);
