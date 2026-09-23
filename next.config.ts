import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * These are the ones that are invisible in a browser and only show up in a
 * post-deploy scan. The site is fully static and loads nothing from third
 * parties — fonts are self-hosted by `next/font`, and the only external URLs
 * anywhere are outbound `<a href>` links in the resources list, which CSP does
 * not govern — so the policy can be genuinely tight.
 *
 * `'unsafe-inline'` in script-src is required: the App Router streams its
 * hydration payload as inline `<script>` tags, and the no-flash theme snippet
 * in the root layout is inline by design. Nonces would mean giving up static
 * rendering, which is not a trade worth making here. Everything else the
 * directive buys — blocking external script origins, `base-uri`, `form-action`,
 * `frame-ancestors`, `object-src` — still applies.
 */

/**
 * `'unsafe-eval'` is added in development only.
 *
 * `next dev` compiles with eval-based source maps and loads React Refresh,
 * which evaluates strings at runtime. Under the production policy those
 * evaluates are refused, the client bundle throws on its first statement, and
 * the page never hydrates: the server-rendered header is visible but inert —
 * the search dialog, the theme toggle and the mobile drawer all stop
 * responding. Production builds contain no eval, so the shipped policy stays
 * strict; this only unblocks local development.
 */
const isDev = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  // Stops a browser from re-interpreting a text response as script/style.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy clickjacking guard; CSP's frame-ancestors covers modern browsers.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send the origin to other sites, but never the full path — article slugs
  // would otherwise leak to every outbound link in the resources list.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these; explicitly deny rather than leave them open.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Only meaningful over HTTPS, which is where it will be served. No `preload`
  // and no `includeSubDomains`: preload is a one-way door and needs the whole
  // domain to be HTTPS-only forever, which is not a call to make silently.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
