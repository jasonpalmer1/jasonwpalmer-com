#!/usr/bin/env node
/**
 * send-dispatch.mjs
 *
 * Send a dispatch email to all confirmed subscribers.
 *
 * Usage:
 *   node scripts/send-dispatch.mjs [slug] [--dry]
 *
 *   slug   — filename stem under src/content/posts/<slug>.mdx
 *             If omitted, the post with the newest frontmatter date is used.
 *   --dry  — print what WOULD be sent without sending anything.
 *
 * Env vars (loaded from .env at repo root if present, then process.env):
 *   RESEND_API_KEY  — required (error if missing)
 *   SITE_URL        — default: https://jasonwpalmer.com
 *   FROM_EMAIL      — default: Jason Palmer <dispatch@jasonwpalmer.com>
 */

import { execSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const POSTS_DIR = join(ROOT, "src", "content", "posts");

// ---------------------------------------------------------------------------
// Load .env from repo root (manual parse — no dotenv dep required)
// ---------------------------------------------------------------------------
function loadDotEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}
loadDotEnv();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const SITE_URL = (process.env.SITE_URL || "https://jasonwpalmer.com").replace(/\/$/, "");
const FROM_EMAIL = process.env.FROM_EMAIL || "Jason Palmer <dispatch@jasonwpalmer.com>";
const SEND_DELAY_MS = 600; // ~600ms between sends (Resend free tier: 100 req/min)

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const isDry = args.includes("--dry");
const slugArg = args.find((a) => !a.startsWith("--")) || null;

// ---------------------------------------------------------------------------
// Parse frontmatter (gray-matter)
// ---------------------------------------------------------------------------
async function loadMatter(filePath) {
  // gray-matter is a CJS module; import() works in Node ESM
  const { default: matter } = await import("gray-matter");
  const src = readFileSync(filePath, "utf-8");
  return matter(src);
}

// ---------------------------------------------------------------------------
// Resolve which post to send
// ---------------------------------------------------------------------------
async function resolvePost() {
  if (slugArg) {
    const filePath = join(POSTS_DIR, `${slugArg}.mdx`);
    if (!existsSync(filePath)) {
      console.error(`[dispatch] ERROR: Post not found: ${filePath}`);
      process.exit(1);
    }
    const { data } = await loadMatter(filePath);
    return { title: data.title, summary: data.summary || "", slug: slugArg };
  }

  // Find newest by frontmatter date
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  if (files.length === 0) {
    console.error("[dispatch] ERROR: No .mdx files found in src/content/posts/");
    process.exit(1);
  }

  let newest = null;
  let newestDate = null;
  for (const file of files) {
    const filePath = join(POSTS_DIR, file);
    const { data } = await loadMatter(filePath);
    const d = data.date ? new Date(data.date) : new Date(0);
    if (!newestDate || d > newestDate) {
      newestDate = d;
      newest = { title: data.title, summary: data.summary || "", slug: file.replace(/\.mdx$/, "") };
    }
  }
  return newest;
}

// ---------------------------------------------------------------------------
// Fetch confirmed subscribers via wrangler d1
// ---------------------------------------------------------------------------
function fetchSubscribers() {
  console.log("[dispatch] Fetching confirmed subscribers from D1 (remote)…");
  let output;
  try {
    output = execSync(
      `npx wrangler d1 execute dispatch-subscribers --remote --json --command "SELECT email, token FROM subscribers WHERE status='confirmed'"`,
      { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );
  } catch (err) {
    console.error("[dispatch] ERROR: wrangler d1 execute failed:");
    console.error(err.stderr || err.message);
    process.exit(1);
  }

  // wrangler --json returns an array: [{ results: [...], ... }]
  let parsed;
  try {
    parsed = JSON.parse(output);
  } catch {
    console.error("[dispatch] ERROR: Could not parse wrangler JSON output:");
    console.error(output.slice(0, 500));
    process.exit(1);
  }

  const results = Array.isArray(parsed) ? parsed[0]?.results : parsed?.results;
  if (!Array.isArray(results)) {
    console.error("[dispatch] ERROR: Unexpected wrangler output shape:", JSON.stringify(parsed).slice(0, 300));
    process.exit(1);
  }
  return results; // [{ email, token }, ...]
}

// ---------------------------------------------------------------------------
// Build dispatch email HTML (inline-styled, email-client safe)
// ---------------------------------------------------------------------------
function buildDispatchHtml({ title, summary, slug, token }) {
  const postUrl = `${SITE_URL}/blog/${slug}/`;
  const unsubUrl = `${SITE_URL}/api/unsubscribe?token=${token}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0e16;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e16;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;border-bottom:1px solid #1f2937;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.15em;color:#34f5c5;text-transform:uppercase;">// dispatch log</p>
              <h1 style="margin:6px 0 0 0;font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">JASON PALMER</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 0;">
              <p style="margin:0 0 8px 0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.15em;color:#6b7280;text-transform:uppercase;">new dispatch</p>
              <h2 style="margin:0 0 16px 0;font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">${escHtml(title)}</h2>
              <p style="margin:0 0 32px 0;font-family:'Courier New',Courier,monospace;font-size:14px;line-height:1.7;color:#9ca3af;">${escHtml(summary)}</p>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:6px;background:#34f5c5;">
                    <a href="${postUrl}"
                       style="display:inline-block;padding:14px 28px;font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:700;letter-spacing:0.1em;color:#0a0e16;text-decoration:none;text-transform:uppercase;">
                      READ THE FULL DISPATCH →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid #1f2937;padding-top:24px;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#374151;line-height:1.6;">
                You're receiving this because you subscribed at
                <a href="${SITE_URL}" style="color:#34f5c5;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>.
                <br />
                <a href="${unsubUrl}" style="color:#4b5563;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Send via Resend
// ---------------------------------------------------------------------------
async function sendEmail({ to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(`Resend ${res.status}: ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Throttle helper
// ---------------------------------------------------------------------------
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!RESEND_API_KEY) {
    console.error("[dispatch] ERROR: RESEND_API_KEY is not set. Add it to .env or export it before running.");
    process.exit(1);
  }

  const post = await resolvePost();
  console.log(`[dispatch] Post: "${post.title}" (slug: ${post.slug})`);

  const subscribers = fetchSubscribers();
  console.log(`[dispatch] Confirmed subscribers: ${subscribers.length}`);

  if (subscribers.length === 0) {
    console.log("[dispatch] No subscribers to send to. Done.");
    return;
  }

  const subject = `[dispatch] ${post.title}`;

  if (isDry) {
    console.log("\n[dispatch] DRY RUN — nothing will be sent.");
    console.log(`  Subject   : ${subject}`);
    console.log(`  From      : ${FROM_EMAIL}`);
    console.log(`  Recipients: ${subscribers.length}`);
    console.log(`  First     : ${subscribers[0].email}`);
    console.log("\n[dispatch] Done (dry run).");
    return;
  }

  let sent = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < subscribers.length; i++) {
    const { email, token } = subscribers[i];
    const html = buildDispatchHtml({ title: post.title, summary: post.summary, slug: post.slug, token });

    try {
      await sendEmail({ to: email, subject, html });
      sent++;
      console.log(`[dispatch] [${sent}/${subscribers.length}] Sent → ${email}`);
    } catch (err) {
      failed++;
      errors.push({ email, error: err.message });
      console.error(`[dispatch] FAILED → ${email}: ${err.message}`);
    }

    // Throttle between sends (skip delay after last)
    if (i < subscribers.length - 1) {
      await delay(SEND_DELAY_MS);
    }
  }

  console.log(`\n[dispatch] Done. Sent: ${sent}, Failed: ${failed}`);
  if (errors.length > 0) {
    console.log("[dispatch] Failures:");
    for (const e of errors) {
      console.log(`  ${e.email}: ${e.error}`);
    }
  }
}

main().catch((err) => {
  console.error("[dispatch] Unhandled error:", err);
  process.exit(1);
});
