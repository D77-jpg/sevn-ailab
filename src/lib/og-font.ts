import { getAllPosts } from "./writing";
import { projects, statusMeta } from "./projects";
import { getAllResources, resourceGroups } from "./resources";
import { site } from "./site";

/**
 * Font loading for generated OG images.
 *
 * `@vercel/og` bundles exactly one font — `noto-sans-v27-latin-regular.ttf` —
 * so Chinese text has no glyphs and renders as tofu boxes on any machine
 * without a CJK system font (i.e. every Linux build/deploy target, including
 * Vercel). It happens to look fine on a Windows dev box, which is exactly how
 * this ships broken.
 *
 * Fix: fetch a subset from Google Fonts covering only the characters our
 * content actually uses. The `text=` parameter returns a font containing just
 * those glyphs — ~36 KB for this site instead of 8 MB.
 *
 * Two things that matter and are easy to get wrong:
 *   1. Send **no** User-Agent. With a browser UA you get woff2 (satori can't
 *      read it); with an old-IE UA you get EOT. Node's default UA yields TTF.
 *   2. This font is only ever used server-side to rasterise a PNG. It is never
 *      sent to a browser, so its size is not a page-weight concern.
 */

const STATIC_TEXT = [
  site.name,
  site.tagline,
  site.domain,
  site.author.name,
  site.author.role,
  "把想法做成真正能跑起来的产品。",
  site.core.join(" "),
  "文章",
  "项目",
  "资源",
  "资源记录",
  ...Object.values(statusMeta).flatMap((s) => [s.label, s.note]),
  ...resourceGroups.map((g) => g.label),
].join(" ");

/**
 * Punctuation the cards actually draw.
 *
 * `·` is U+00B7 and sits *outside* printable ASCII (32–126), so listing the
 * ASCII range is not enough: the homepage kicker is `site.core.join("  ·  ")`
 * and would render a tofu box in the middle of "AI · CODE · AGENT". Same trap
 * for the em dash and the CJK date units used in article footers.
 */
const PUNCTUATION = "·—–…／｜|：·、，。年月日";

/** Every character an OG card might need to draw. */
export function ogCharset(): string {
  const dynamic = [
    ...getAllPosts().flatMap((p) => [p.title, p.summary, p.category]),
    ...projects.flatMap((p) => [p.name, p.statusLabel]),
    // Resource cards draw the tool name and its group. `use` is not drawn, but
    // it is short and the extra glyphs cost almost nothing at this size.
    ...getAllResources().flatMap((r) => [r.name, r.groupLabel]),
  ].join(" ");

  // Printable ASCII.
  const ascii = Array.from({ length: 95 }, (_, i) =>
    String.fromCharCode(32 + i),
  ).join("");

  return [
    ...new Set((dynamic + " " + STATIC_TEXT + PUNCTUATION + ascii).split("")),
  ].join("");
}

let cache: { key: string; font: ArrayBuffer | null } | null = null;

/**
 * Returns a TTF containing every glyph the cards need, or `null` if it can't
 * be fetched — in which case callers must fall back to Latin-only text rather
 * than letting CJK render as boxes.
 */
export async function loadOgFont(): Promise<ArrayBuffer | null> {
  const charset = ogCharset();
  if (cache?.key === charset) return cache.font;

  const font = await fetchSubset(charset);
  cache = { key: charset, font };
  return font;
}

async function fetchSubset(charset: string): Promise<ArrayBuffer | null> {
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600&text=" +
    encodeURIComponent(charset);

  try {
    // Deliberately no User-Agent header — see the note above.
    const cssRes = await fetch(cssUrl);
    if (!cssRes.ok) {
      warnDegraded(`css2 returned ${cssRes.status}`);
      return null;
    }

    const css = await cssRes.text();
    const url = css.match(/url\((https:[^)]+)\)/)?.[1];
    if (!url) {
      warnDegraded("no font url in the css response");
      return null;
    }

    const fontRes = await fetch(url);
    if (!fontRes.ok) {
      warnDegraded(`font fetch returned ${fontRes.status}`);
      return null;
    }

    const buf = await fontRes.arrayBuffer();
    // Guard against silently getting woff2/eot back, which satori cannot parse
    // and which would fail much later with a confusing error.
    const magic = new DataView(buf).getUint32(0).toString(16);
    if (magic !== "10000") {
      warnDegraded(`unexpected font format (magic ${magic})`);
      return null;
    }

    return buf;
  } catch (err) {
    warnDegraded(`fetch failed: ${(err as Error).message}`);
    return null;
  }
}

/**
 * Degrading quietly is how a Chinese site ends up shipping Latin-only share
 * cards: the build succeeds, the images look plausible, and nobody notices
 * until a link is pasted into a chat. Make it loud enough to see in CI logs.
 *
 * The fetch happens at build time (these routes are prerendered), so a build
 * environment without access to fonts.googleapis.com loses CJK here.
 */
function warnDegraded(reason: string) {
  console.warn(
    [
      "",
      "┌────────────────────────────────────────────────────────────────┐",
      "│ OG FONT DEGRADED — Chinese text will be omitted from OG cards  │",
      "└────────────────────────────────────────────────────────────────┘",
      `  reason: ${reason}`,
      "  The cards still render, falling back to Latin-only text.",
      "  Fix: allow build-time access to fonts.googleapis.com, then rebuild.",
      "",
    ].join("\n"),
  );
}
