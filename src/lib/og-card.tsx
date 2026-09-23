import { OG_PALETTE as P } from "./og";
import { site } from "./site";

/** Name the subset font is registered under in `ImageResponse`. */
export const OG_FONT_FAMILY = "Noto Serif SC";

export function OgCard({
  kicker,
  title,
  subtitle,
  meta,
  cjk,
}: {
  /** Small mono label above the title — category, status, section. */
  kicker: string;
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Bottom-left mono metadata. */
  meta: string;
  /** False when the CJK subset couldn't be loaded: drop non-Latin text. */
  cjk: boolean;
}) {
  const fontFamily = cjk ? OG_FONT_FAMILY : "sans-serif";
  const heading = cjk ? title : latinFallback(title);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: P.paper,
        padding: "68px 80px",
        fontFamily,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1.5px solid ${P.lineStrong}`,
            borderRadius: 10,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: P.accent,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: -0.5,
            color: P.ink,
            fontWeight: 600,
          }}
        >
          SEVN
          <span style={{ color: P.faint, fontWeight: 400, marginLeft: 10 }}>
            AILAB
          </span>
        </div>
      </div>

      {/* Headline block */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            width: 96,
            height: 2,
            background: P.accent,
            marginBottom: 34,
          }}
        />
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 21,
            letterSpacing: 2.4,
            color: P.accent,
            marginBottom: 22,
          }}
        >
          {kicker.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: heading.length > 22 ? 62 : 80,
            lineHeight: 1.14,
            letterSpacing: -1.6,
            color: P.ink,
            fontWeight: 600,
            maxWidth: 1000,
          }}
        >
          {heading}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              lineHeight: 1.4,
              color: P.muted,
              letterSpacing: -0.3,
              maxWidth: 940,
            }}
          >
            {subtitle}
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
          paddingTop: 26,
          fontFamily: "monospace",
          fontSize: 21,
          letterSpacing: 1.5,
          color: P.faint,
        }}
      >
        <div style={{ display: "flex" }}>{meta}</div>
        <div style={{ display: "flex" }}>{site.domain}</div>
      </div>
    </div>
  );
}

/**
 * If the CJK font is unavailable, showing boxes is worse than showing nothing.
 * Fall back to the Latin parts of the string, and if there are none, to the
 * brand statement so the card still reads as intentional.
 */
function latinFallback(title: string): string {
  const latin = title.replace(/[^\x20-\x7E·]/g, "").replace(/\s+/g, " ").trim();
  return latin.length >= 3 ? latin : site.tagline;
}
