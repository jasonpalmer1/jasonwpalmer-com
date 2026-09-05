/**
 * Shared defensive helpers for Pages Functions.
 * No CORS. No stack traces. No secrets in responses.
 */

export const ALLOWED_HOSTS = Object.freeze(["jasonwpalmer.com", "www.jasonwpalmer.com"]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const SECURITY_HEADERS = Object.freeze({
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
});

const CORS_HEADERS = [
  "Access-Control-Allow-Origin",
  "Access-Control-Allow-Methods",
  "Access-Control-Allow-Headers",
  "Access-Control-Allow-Credentials",
  "Access-Control-Expose-Headers",
  "Access-Control-Max-Age",
];

export function hostnameOf(request) {
  try {
    return new URL(request.url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function isAllowedHost(request) {
  const host = hostnameOf(request);
  return isLocalHost(host) || ALLOWED_HOSTS.includes(host);
}

function isAllowedWebOrigin(origin) {
  if (!origin || typeof origin !== "string") return false;
  try {
    const u = new URL(origin);
    const host = u.hostname.toLowerCase();
    if (isLocalHost(host)) return u.protocol === "http:" || u.protocol === "https:";
    return u.protocol === "https:" && ALLOWED_HOSTS.includes(host);
  } catch {
    return false;
  }
}

/**
 * Browser POSTs send Origin. Referer is a fallback. Missing both → reject.
 * Localhost hosts skip this (wrangler pages dev).
 */
export function isAllowedOrigin(request) {
  if (isLocalHost(hostnameOf(request))) return true;
  const origin = request.headers.get("Origin");
  if (origin) return isAllowedWebOrigin(origin);
  const referer = request.headers.get("Referer");
  if (referer) return isAllowedWebOrigin(referer);
  return false;
}

export function isUuid(token) {
  return typeof token === "string" && UUID_RE.test(token);
}

export function stripCors(headers) {
  for (const name of CORS_HEADERS) headers.delete(name);
  return headers;
}

export function applySecurityHeaders(headers, extras) {
  stripCors(headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (key === "Cache-Control" && headers.has(key)) continue;
    headers.set(key, value);
  }
  if (extras) {
    for (const [key, value] of Object.entries(extras)) {
      headers.set(key, value);
    }
  }
  return headers;
}

export function withSecurityHeaders(response, extras) {
  const headers = new Headers(response.headers);
  applySecurityHeaders(headers, extras);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function json(body, status = 200, extras) {
  const headers = new Headers({ "Content-Type": "application/json" });
  applySecurityHeaders(headers, extras);
  return new Response(JSON.stringify(body), { status, headers });
}

export function notFound() {
  const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8" });
  applySecurityHeaders(headers);
  return new Response("Not found", { status: 404, headers });
}

export async function readJsonLimited(request, maxBytes = 4096) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }
  const buf = await request.arrayBuffer();
  if (buf.byteLength > maxBytes) {
    return { ok: false, error: "Request too large.", status: 413 };
  }
  try {
    const data = JSON.parse(new TextDecoder().decode(buf));
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, error: "Invalid request body.", status: 400 };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }
}
