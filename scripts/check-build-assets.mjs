#!/usr/bin/env node
/**
 * Fail if any tools.ts gallery src is missing under public/.
 * Claude / CI: node scripts/check-build-assets.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toolsPath = join(root, "src/data/tools.ts");
const src = readFileSync(toolsPath, "utf8");
const paths = [...src.matchAll(/src:\s*"(\/builds\/[^"]+)"/g)].map((m) => m[1]);
const missing = paths.filter((p) => !existsSync(join(root, "public", p.slice(1))));

if (missing.length) {
  console.error("[check-build-assets] Missing files:");
  for (const p of missing) console.error("  ", p);
  process.exit(1);
}
console.log(`[check-build-assets] OK — ${paths.length} gallery assets present.`);
