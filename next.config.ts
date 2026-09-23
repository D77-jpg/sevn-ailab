import type { NextConfig } from "next";

import { securityHeaders } from "./config/security-headers.mjs";

/**
 * Deployment target: Cloudflare (Pages or Workers static assets).
 *
 * `output: "export"` renders every route to plain files in `out/` — HTML,
 * RSC payloads, OG images, rss.xml, sitemap.xml, search-index.json. There is
 * no Node server in production, so nothing here may depend on one:
 *
 *   - no `searchParams` in server components (the /writing filter runs on the
 *     client instead),
 *   - no image optimizer (`images.unoptimized`; hero variants are pre-encoded
 *     in `public/` by `npm run images`),
 *   - no `headers()` in production (they are emitted to `out/_headers` by
 *     `scripts/postbuild.mjs` from the same source used below).
 */
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // `/about` is served from `about.html`; Cloudflare resolves that natively.
  trailingSlash: false,
  poweredByHeader: false,
  // Headers only apply to `next dev` / `next start`. Next warns that headers
  // do not work with `output: "export"` — that is expected and handled.
  ...(isDev
    ? {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders({ dev: true }) }];
        },
      }
    : {}),
};

export default nextConfig;
