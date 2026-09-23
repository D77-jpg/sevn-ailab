// @ts-check
/**
 * Security headers — single source of truth.
 *
 * Used in two places:
 *   1. `next.config.ts` applies them to `next dev`, so CSP problems surface
 *      locally instead of after a deploy.
 *   2. `scripts/postbuild.mjs` writes them into `out/_headers`, which is how
 *      Cloudflare (Pages or Workers static assets) serves them in production.
 *      A static export has no server, so `next.config.ts#headers()` does
 *      nothing there — without the generated file the site would ship with
 *      no security headers at all.
 *
 * `'unsafe-inline'` in script-src is required: the App Router streams its RSC
 * payload as inline `<script>` tags, and the no-flash theme snippet in the root
 * layout is inline by design. Nonces would need a server per request, which a
 * static export does not have. Everything else — blocking external script
 * origins, `base-uri`, `form-action`, `frame-ancestors`, `object-src` — applies.
 *
 * If you enable Cloudflare Web Analytics, add
 *   script-src  https://static.cloudflareinsights.com
 *   connect-src https://cloudflareinsights.com
 * below — otherwise the beacon is silently blocked.
 */

/** @param {{ dev?: boolean }} [opts] */
export function contentSecurityPolicy({ dev = false } = {}) {
  return [
    "default-src 'self'",
    // `next dev` evaluates strings (eval source maps + React Refresh). Without
    // this the dev client throws on its first statement and never hydrates.
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

/**
 * @param {{ dev?: boolean }} [opts]
 * @returns {{ key: string, value: string }[]}
 */
export function securityHeaders({ dev = false } = {}) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy({ dev }) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Matches `frame-ancestors 'none'` for browsers that predate it.
    { key: "X-Frame-Options", value: "DENY" },
    // Send only the origin to other sites — article slugs never leak through
    // the outbound links in the resources list.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    // No `includeSubDomains`, no `preload`: both are hard to undo and commit
    // every subdomain to HTTPS forever. Turn them on deliberately, if ever.
    ...(dev
      ? []
      : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
  ];
}
