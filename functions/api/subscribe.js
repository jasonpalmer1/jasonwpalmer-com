/**
 * POST /api/subscribe
 * Body: { email: string, botcheck?: string }
 *
 * Stores the subscriber in D1 (status = "pending") and sends a
 * Resend confirmation email if RESEND_API_KEY is present.
 *
 * Security:
 *  - All D1 queries use parameterized bindings — no string interpolation.
 *  - Email validated server-side; max 254 chars; lowercased + trimmed.
 *  - Token generated with crypto.randomUUID().
 *  - RESEND_API_KEY never logged or returned.
 *  - Honeypot field `botcheck` (filled = silent success, no write/send).
 *  - Per-IP Cache API rate limit + per-email confirm cooldown.
 *  - Optional Turnstile when env.TURNSTILE_SECRET_KEY is set (no-op otherwise).
 *  - Uniform success copy (no email enumeration).
 *  - Missing RESEND_API_KEY → subscriber stored, ok returned (no 500).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONFIRM_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes per email
const IP_LIMIT = 10; // subscribes per IP per window
const IP_WINDOW_SECONDS = 3600;

const SUCCESS_MSG = "Almost there — check your inbox to confirm.";

function buildConfirmationHtml(confirmUrl, siteUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm your subscription</title>
</head>
<body style="margin:0;padding:0;background:#0a0e16;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e16;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.15em;color:#34f5c5;text-transform:uppercase;">// dispatch log</p>
              <h1 style="margin:8px 0 0 0;font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">JASON PALMER</h1>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:40px 32px;">
              <p style="margin:0 0 8px 0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.15em;color:#6b7280;text-transform:uppercase;">action required</p>
              <h2 style="margin:0 0 16px 0;font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:700;color:#ffffff;">Confirm your subscription</h2>
              <p style="margin:0 0 24px 0;font-family:'Courier New',Courier,monospace;font-size:14px;line-height:1.6;color:#9ca3af;">
                You requested to subscribe to the dispatch log — build notes, tools shipped, and operator thinking from jasonwpalmer.com.
              </p>
              <p style="margin:0 0 32px 0;font-family:'Courier New',Courier,monospace;font-size:14px;line-height:1.6;color:#9ca3af;">
                Click below to confirm. If you didn&apos;t request this, ignore this email — nothing will happen.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:6px;background:#34f5c5;">
                    <a href="${confirmUrl}"
                       style="display:inline-block;padding:14px 28px;font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:700;letter-spacing:0.1em;color:#0a0e16;text-decoration:none;text-transform:uppercase;">
                      CONFIRM SUBSCRIPTION →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#4b5563;">
                Or copy this link into your browser:<br />
                <span style="color:#34f5c5;word-break:break-all;">${confirmUrl}</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#374151;">
                &copy; Jason Palmer &mdash; <a href="${siteUrl}" style="color:#34f5c5;text-decoration:none;">${siteUrl.replace(/^https?:\/\//, '')}</a>
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

function ok() {
  return Response.json({ ok: true, message: SUCCESS_MSG });
}

/** Optional Cloudflare Turnstile — skipped when secret unset (scaffold). */
async function verifyTurnstile(token, env, ip) {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token || typeof token !== "string") return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }),
      }
    );
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

/** Cheap per-IP throttle via Cache API (best-effort on the edge). */
async function isIpRateLimited(request) {
  try {
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const cache = caches.default;
    const key = new Request(`https://subscribe-rate.invalid/${encodeURIComponent(ip)}`);
    const hit = await cache.match(key);
    let count = 0;
    if (hit) {
      count = parseInt(await hit.text(), 10) || 0;
      if (count >= IP_LIMIT) return true;
    }
    await cache.put(
      key,
      new Response(String(count + 1), {
        headers: { "Cache-Control": `max-age=${IP_WINDOW_SECONDS}` },
      })
    );
    return false;
  } catch {
    return false; // fail open if Cache API unavailable
  }
}

function parseSqliteUtc(ts) {
  if (!ts || typeof ts !== "string") return null;
  // D1/SQLite datetime('now') → "YYYY-MM-DD HH:MM:SS"
  const iso = ts.includes("T") ? ts : ts.replace(" ", "T") + "Z";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields; humans leave them empty.
  if (body.botcheck || body.website) {
    return ok();
  }

  const ip = request.headers.get("cf-connecting-ip") || "";
  const turnstileOk = await verifyTurnstile(body.turnstileToken, env, ip);
  if (!turnstileOk) {
    return Response.json(
      { ok: false, error: "Verification failed — please try again." },
      { status: 403 }
    );
  }

  if (await isIpRateLimited(request)) {
    return Response.json(
      { ok: false, error: "Too many requests — try again later." },
      { status: 429 }
    );
  }

  // --- Validate email ---
  const raw = typeof body.email === "string" ? body.email : "";
  const email = raw.trim().toLowerCase();

  if (!email) {
    return Response.json({ ok: false, error: "Email address is required." }, { status: 400 });
  }
  if (email.length > 254) {
    return Response.json({ ok: false, error: "Email address is too long." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const db = env.DB;
  if (!db) {
    return Response.json({ ok: false, error: "Service unavailable." }, { status: 503 });
  }

  const siteUrl = (env.SITE_URL || "https://jasonwpalmer.com").replace(/\/$/, "");
  const fromEmail = env.FROM_EMAIL || "Jason Palmer <dispatch@jasonwpalmer.com>";

  // --- Check for existing subscriber ---
  let existing;
  try {
    existing = await db.prepare(
      "SELECT id, status, token, created_at FROM subscribers WHERE email = ?"
    ).bind(email).first();
  } catch {
    return Response.json({ ok: false, error: "Database error." }, { status: 500 });
  }

  // Already confirmed — same success copy (no enumeration), no email.
  if (existing && existing.status === "confirmed") {
    return ok();
  }

  // Pending + still in cooldown — don't rotate token / re-send.
  if (existing && existing.status === "pending") {
    const created = parseSqliteUtc(existing.created_at);
    if (created && Date.now() - created < CONFIRM_COOLDOWN_MS) {
      return ok();
    }
  }

  // --- Generate a fresh token ---
  const token = crypto.randomUUID();
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  if (existing) {
    // Reset pending/unsubscribed → pending with new token
    try {
      await db.prepare(
        "UPDATE subscribers SET status = 'pending', token = ?, created_at = ? WHERE email = ?"
      ).bind(token, now, email).run();
    } catch {
      return Response.json({ ok: false, error: "Database error." }, { status: 500 });
    }
  } else {
    try {
      await db.prepare(
        "INSERT INTO subscribers (email, status, token, created_at) VALUES (?, 'pending', ?, ?)"
      ).bind(email, token, now).run();
    } catch (err) {
      // Concurrent first-insert race on UNIQUE(email) — treat as success.
      const msg = String(err && err.message ? err.message : err);
      if (/unique|constraint/i.test(msg)) return ok();
      return Response.json({ ok: false, error: "Database error." }, { status: 500 });
    }
  }

  // --- Send confirmation email (best-effort) ---
  if (env.RESEND_API_KEY) {
    const confirmUrl = `${siteUrl}/api/confirm?token=${encodeURIComponent(token)}`;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: "Confirm your subscription to Jason's dispatch log",
          html: buildConfirmationHtml(confirmUrl, siteUrl),
        }),
      });
      if (!res.ok) {
        // Non-fatal for the subscriber row; do not leak status details or the key.
        await res.text().catch(() => "");
      }
    } catch {
      // Intentional: send failure is non-fatal — subscriber is already stored.
    }
  }

  return ok();
}
