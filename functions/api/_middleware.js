/**
 * /api/* only — does not wrap static assets.
 * Locks write APIs to the apex/www hosts and strips any CORS headers.
 */
import { isAllowedHost, notFound, withSecurityHeaders } from "../_lib/security.js";

export async function onRequest(context) {
  if (!isAllowedHost(context.request)) {
    return notFound();
  }

  const response = await context.next();
  return withSecurityHeaders(response);
}
