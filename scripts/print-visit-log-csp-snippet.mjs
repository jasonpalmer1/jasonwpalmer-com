#!/usr/bin/env node
/**
 * Prints the visit-log CSP allowlist fragment for sibling sites' _headers.
 * See docs/feature-scaffolds/visit-log-csp.md
 */

const HOST = "https://visit-log.jwpalm99.workers.dev";

console.log(`# visit-log CSP allowlist — paste into Content-Security-Policy
# script-src must include:  ${HOST}
# connect-src must include: ${HOST}
#
# Beacon:
#   <script defer src="${HOST}/v.js"></script>
`);
console.log(`script-src fragment: ${HOST}`);
console.log(`connect-src fragment: ${HOST}`);
