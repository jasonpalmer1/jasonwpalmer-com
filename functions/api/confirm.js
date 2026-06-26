/**
 * GET /api/confirm?token=<uuid>
 *
 * Confirms a subscriber's email address by setting status = 'confirmed'.
 * Returns a full dark-theme HTML page (no JS dependency).
 *
 * Security:
 *  - token looked up with parameterized binding — no string interpolation.
 *  - Refuses to confirm already-unsubscribed rows (WHERE status != 'unsubscribed').
 *  - result.meta.changes determines whether the token was valid.
 */

function page({ title, heading, body, siteUrl, isSuccess }) {
  const accentColor = isSuccess ? "#34f5c5" : "#f87171";
  const icon = isSuccess ? "✓" : "✗";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Jason Palmer</title>
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
    .icon {
      font-size: 2.5rem;
      color: ${accentColor};
      margin-bottom: 16px;
    }
    .label {
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #9ca3af;
      margin-bottom: 24px;
    }
    a.btn {
      display: inline-block;
      padding: 12px 24px;
      background: ${accentColor};
      color: #0a0e16;
      text-decoration: none;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 6px;
    }
    a.btn:hover { opacity: 0.9; }
    .footer {
      margin-top: 24px;
      font-size: 11px;
      color: #374151;
    }
    .footer a { color: #34f5c5; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <p class="label">// dispatch log</p>
    <h1>${heading}</h1>
    <p>${body}</p>
    <a href="${siteUrl}" class="btn">← BACK TO SITE</a>
    <p class="footer">
      <a href="${siteUrl}">jasonwpalmer.com</a>
    </p>
  </div>
</body>
</html>`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const siteUrl = (env.SITE_URL || "https://jasonwpalmer.com").replace(/\/$/, "");

  if (!token) {
    return new Response(
      page({
        title: "Invalid link",
        heading: "Link invalid or expired",
        body: "This confirmation link is missing a token. Please subscribe again.",
        siteUrl,
        isSuccess: false,
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const db = env.DB;
  if (!db) {
    return new Response(
      page({
        title: "Service unavailable",
        heading: "Service unavailable",
        body: "Something went wrong on our end. Please try again later.",
        siteUrl,
        isSuccess: false,
      }),
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  let result;
  try {
    result = await db.prepare(
      "UPDATE subscribers SET status = 'confirmed', confirmed_at = datetime('now') WHERE token = ? AND status != 'unsubscribed'"
    ).bind(token).run();
  } catch {
    return new Response(
      page({
        title: "Error",
        heading: "Something went wrong",
        body: "We couldn't confirm your subscription. Please try again later.",
        siteUrl,
        isSuccess: false,
      }),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  if (!result.meta || result.meta.changes === 0) {
    return new Response(
      page({
        title: "Link invalid or expired",
        heading: "Link invalid or expired",
        body: "This confirmation link has already been used, is expired, or doesn't exist. If you'd like to subscribe, please enter your email again.",
        siteUrl,
        isSuccess: false,
      }),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  return new Response(
    page({
      title: "You're confirmed",
      heading: "You're subscribed.",
      body: "Your email is confirmed. You'll get a dispatch each time something new ships. No spam — unsubscribe anytime.",
      siteUrl,
      isSuccess: true,
    }),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
