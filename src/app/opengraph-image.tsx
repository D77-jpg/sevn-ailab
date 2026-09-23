import { ogImage, OG_SIZE } from "@/lib/og-card";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

/**
 * Site-wide fallback card. Articles, projects and resources override this with
 * their own `opengraph-image.tsx`, so a shared link shows what it links to.
 */
export default function OpengraphImage() {
  return ogImage({
    kicker: site.core.join("  ·  "),
    title: site.tagline,
    subtitle: "把想法做成真正能跑起来的产品。",
    meta: "BUILD WITH AI",
  });
}
