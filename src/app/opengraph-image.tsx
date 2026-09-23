import { ImageResponse } from "next/og";

import { site } from "@/lib/site";
import { OgCard, OG_FONT_FAMILY } from "@/lib/og-card";
import { loadOgFont } from "@/lib/og-font";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide fallback card. Articles and projects override this with their own
 * `opengraph-image.tsx`, so a shared link shows what it actually links to.
 */
export default async function OpengraphImage() {
  const font = await loadOgFont();

  return new ImageResponse(
    (
      <OgCard
        kicker={site.core.join("  ·  ")}
        title={site.tagline}
        subtitle={font ? "把想法做成真正能跑起来的产品。" : undefined}
        meta={font ? "AI · CODE · AGENT" : "BUILD WITH AI"}
        cjk={font !== null}
      />
    ),
    {
      ...size,
      fonts: font
        ? [{ name: OG_FONT_FAMILY, data: font, weight: 600, style: "normal" }]
        : [],
    },
  );
}
