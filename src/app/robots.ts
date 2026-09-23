import type { MetadataRoute } from "next";

export const dynamic = "force-static";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The search index is a build artifact fetched by the dialog, not a
        // page. Crawling it wastes budget and can surface raw JSON in results.
        disallow: ["/search-index.json"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
