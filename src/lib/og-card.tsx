import { ImageResponse } from "next/og";

import { OG_PALETTE as P } from "./og";
import { OG_FONT_FAMILY, loadOgFonts } from "./og-font";
import { site } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

type CardProps = {
  /** Small label above the title — category, status, section. */
  kicker: string;
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Bottom-left metadata. */
  meta: string;
};

/**
 * The share card. Mirrors the site's V3 look: #f5f5f7 canvas, the ink tile
 * with the blue dot from the header mark, a big tight sans headline, one
 * hairline above the footer. No gradients, no photos — it has to read at
 * thumbnail size in a WeChat chat bubble.
 */
function OgCard({ kicker, title, subtitle, meta }: CardProps) {
  const long = title.length > 20;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: P.paper,
        padding: "64px 80px 56px",
        fontFamily: OG_FONT_FAMILY,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: P.ink,
            borderRadius: 11,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: P.accent,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: -0.6,
            color: P.ink,
            fontWeight: 700,
          }}
        >
          SEVN
          <span style={{ color: P.faint, fontWeight: 400, marginLeft: 9 }}>
            AILAB
          </span>
        </div>
      </div>

      {/* Headline */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: P.accent,
            marginBottom: 22,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: long ? 60 : 78,
            lineHeight: 1.12,
            letterSpacing: long ? -1.5 : -2.5,
            color: P.ink,
            fontWeight: 700,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.45,
              color: P.muted,
              fontWeight: 400,
              maxWidth: 960,
            }}
          >
            {subtitle.length > 64 ? `${subtitle.slice(0, 62)}…` : subtitle}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${P.line}`,
          paddingTop: 24,
          fontSize: 21,
          letterSpacing: 1,
          color: P.faint,
          fontWeight: 400,
        }}
      >
        <div style={{ display: "flex" }}>{meta}</div>
        <div style={{ display: "flex", color: P.ink2 }}>{site.domain}</div>
      </div>
    </div>
  );
}

/** Render a share card to PNG. Used by every `opengraph-image.tsx`. */
export async function ogImage(props: CardProps) {
  const fonts = await loadOgFonts();
  return new ImageResponse(<OgCard {...props} />, { ...OG_SIZE, fonts });
}
