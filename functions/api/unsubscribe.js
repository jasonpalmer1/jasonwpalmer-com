/**
 * GET  /api/unsubscribe?token=<uuid>  — interstitial (prefetch-safe)
 * POST /api/unsubscribe               — actually unsubscribes
 *
 * Sets subscriber status = 'unsubscribed'. Idempotent.
 *
 * Security:
 *  - token looked up with parameterized binding — no string interpolation.
 *  - No subscriber info is returned in the response.
 *  - Prefetch-safe: GET alone does not mutate.
 */

const SECURITY_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function page({ title, heading, body, siteUrl, token, done }) {
  const action = token
    ? `<form method="POST" action="/api/unsubscribe">
        <input type="hidden" name="token" value="${esc(token)}" />
        <button type="submit" class="btn">UNSUBSCRIBE →</button>
      </form>`
    : `<a href="${esc(siteUrl)}" class="btn">← BACK TO SITE</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${esc(title)} — Jason Palmer</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%;
      background: #0a0e16;
      color: #e5e7eb;
      font-family: 'Courier New', Courier, monospace;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      max-width: 480px;
      width: 90%;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 40px 32px;
      text-align: center;
    }
    .icon { font-size: 2.5rem; color: #6b7280; margin-bottom: 16px; }
    .label {
      font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
      color: #6b7280; margin-bottom: 8px;
    }
    h1 {
      font-size: 22px; font-weight: 700; color: #ffffff;
      margin-bottom: 16px; letter-spacing: -0.02em;
    }
    p { font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 24px; }
    a.btn, button.btn {
      display: inline-block; padding: 12px 24px; background: #34f5c5;
      color: #0a0e16; text-decoration: none; font-weight: 700; font-size: 12px;
      letter-spacing: 0.1em; text-transform: uppercase; border-radius: 6px;
      border: none; cursor: pointer; font-family: inherit;
    }
    a.btn:hover, button.btn:hover { opacity: 0.9; }
    .footer { margin-top: 24px; font-size: 11px; color: #374151; }
    .footer a { color: #34f5c5; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${done ? "○" : "?"}</div>
    <p class="label">// dispatch log</p>
    <h1>${esc(heading)}</h1>
    <p>${body}</p>
    ${action}
    <p class="footer">
      Changed your mind? <a href="${esc(siteUrl)}">Re-subscribe at jasonwpalmer.com</a>
    </p>
  </div>
</body>
</html>`;
}

function html(status, opts) {
  return new Response(page(opts), { status, headers: SECURITY_HEADERS });
}

async function unsubscribeToken(env, token, siteUrl) {
  if (!token) {
    return html(400, {
      title: "Invalid link",
      heading: "Invalid unsubscribe link",
      body: "This link appears to be missing a token. If you'd like to unsubscribe, use the link in your most recent email.",
      siteUrl,
      done: true,
    });
  }

  const db = env.DB;
  if (!db) {
    return html(503, {
      title: "Service unavailable",
      heading: "Service unavailable",
      body: "Something went wrong on our end. Please try again later.",
      siteUrl,
      done: true,
    });
  }

  let row;
  try {
    row = await db
      .prepare("SELECT status FROM subscribers WHERE token = ?")
      .bind(token)
      .first();
  } catch {
    return html(500, {
      title: "Error",
      heading: "Something went wrong",
      body: "We couldn't process your request. Please try again later.",
      siteUrl,
      done: true,
    });
  }

  if (!row) {
    return html(404, {
      title: "Link not found",
      heading: "Unsubscribe link not found",
      body: "This link is invalid or already expired. If you're still getting emails, use the unsubscribe link in the latest dispatch.",
      siteUrl,
      done: true,
    });
  }

  if (row.status === "unsubscribed") {
    return html(200, {
      title: "Already unsubscribed",
      heading: "You're already unsubscribed.",
      body: "You won't receive any more dispatches. Changed your mind? You can re-subscribe anytime on the site.",
      siteUrl,
      done: true,
    });
  }

  try {
    const result = await db
      .prepare("UPDATE subscribers SET status = 'unsubscribed' WHERE token = ?")
      .bind(token)
      .run();
    if (!result.meta || result.meta.changes === 0) {
      return html(404, {
        title: "Link not found",
        heading: "Unsubscribe link not found",
        body: "This link is invalid or already expired. If you're still getting emails, use the unsubscribe link in the latest dispatch.",
        siteUrl,
        done: true,
      });
    }
  } catch {
    return html(500, {
      title: "Error",
      heading: "Something went wrong",
      body: "We couldn't process your request. Please try again later.",
      siteUrl,
      done: true,
    });
  }

  return html(200, {
    title: "Unsubscribed",
    heading: "You've been unsubscribed.",
    body: "You won't receive any more dispatches. Changed your mind? You can always re-subscribe below.",
    siteUrl,
    done: true,
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const siteUrl = (env.SITE_URL || "https://jasonwpalmer.com").replace(/\/$/, "");

  if (!token) {
    return html(400, {
      title: "Invalid link",
      heading: "Invalid unsubscribe link",
      body: "This link appears to be missing a token. If you'd like to unsubscribe, use the link in your most recent email.",
      siteUrl,
      done: true,
    });
  }

  return html(200, {
    title: "Unsubscribe",
    heading: "Unsubscribe from the dispatch log?",
    body: "Click below to stop receiving emails. You can re-subscribe anytime.",
    siteUrl,
    token,
    done: false,
  });
}

export async function onRequestPost({ request, env }) {
  const siteUrl = (env.SITE_URL || "https://jasonwpalmer.com").replace(/\/$/, "");
  const contentType = request.headers.get("content-type") || "";
  let token = "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    token = typeof body.token === "string" ? body.token : "";
  } else {
    const form = await request.formData().catch(() => null);
    token = form && typeof form.get("token") === "string" ? form.get("token") : "";
    if (!token) {
      const url = new URL(request.url);
      token = url.searchParams.get("token") || "";
    }
  }

  return unsubscribeToken(env, token, siteUrl);
}
