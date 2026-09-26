import type { NextConfig } from "next";

/**
 * SEVN GRADLAB — pure static export, same as apps/sevnai.
 *
 * The output in `out/` is plain files, so it can be hosted anywhere: a
 * domestic object-storage bucket + CDN (recommended once the domain has ICP
 * filing — the audience is students in mainland China), or Cloudflare.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // `/topics/rag-knowledge-qa/` → `topics/rag-knowledge-qa/index.html`.
  // Object-storage static hosting (COS / OSS) resolves `dir/index.html`
  // natively but not extension-less `.html` files, so this keeps every route
  // working without rewrite rules on either kind of host.
  trailingSlash: true,
  poweredByHeader: false,
  transpilePackages: ["@sevn/ui"],
};

export default nextConfig;
