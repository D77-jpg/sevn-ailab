import fs from "node:fs";
import path from "node:path";

import { getAllPosts } from "./writing";
import { projects, statusMeta } from "./projects";
import { getAllResources, resourceGroups } from "./resources";
import { site } from "./site";

/**
 * Fonts for generated OG images.
 *
 * `next/og` bundles a single Latin font, so without help every Chinese title
 * renders as tofu on Linux build machines — Cloudflare's included.
 *
 * Primary source is **vendored**: `assets/og/NotoSansSC-*.subset.otf`, a
 * Noto Sans SC subset (GB2312 level-1, ~3,750 common hanzi + every character
 * the site used when it was generated; see `scripts/subset-og-font.py`). It is
 * read from disk at build time, so OG cards never depend on the network.
 *
 * Fallback: if a new post uses a rarer character the subset lacks, the missing
 * glyphs — and only those — are fetched from Google Fonts. If that fails too,
 * the build logs a loud warning instead of silently shipping tofu.
 *
 * These files rasterise PNGs at build time; they are never sent to browsers.
 */

export const OG_FONT_FAMILY = "Noto Sans SC";

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

const ASSET_DIR = path.join(process.cwd(), "assets", "og");

const STATIC_TEXT = [
  site.name,
  site.tagline,
  site.domain,
  site.author.name,
  site.author.role,
  "把想法做成真正能跑起来的产品。",
  site.core.join(" "),
  "文章 项目 资源 资源记录 一个公开的 AI 实验室",
  ...Object.values(statusMeta).flatMap((s) => [s.label, s.note]),
  ...resourceGroups.map((g) => g.label),
].join(" ");

/** Every character an OG card might need to draw. */
export function ogCharset(): Set<string> {
  const dynamic = [
    ...getAllPosts().flatMap((p) => [p.title, p.summary]),
    ...projects.flatMap((p) => [p.name, p.statusLabel, p.summary]),
    ...getAllResources().flatMap((r) => [r.name, r.groupLabel, r.use]),
  ].join(" ");
  return new Set(Array.from(dynamic + STATIC_TEXT).filter((ch) => ch.trim()));
}

function readBuffer(file: string): ArrayBuffer | null {
  try {
    const buf = fs.readFileSync(path.join(ASSET_DIR, file));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch {
    return null;
  }
}

let cached: Promise<OgFont[]> | null = null;

/** Resolved once per build process and shared by every OG route. */
export function loadOgFonts(): Promise<OgFont[]> {
  cached ??= resolveFonts();
  return cached;
}

async function resolveFonts(): Promise<OgFont[]> {
  const fonts: OgFont[] = [];

  const bold = readBuffer("NotoSansSC-Bold.subset.otf");
  const regular = readBuffer("NotoSansSC-Regular.subset.otf");
  if (bold) fonts.push({ name: OG_FONT_FAMILY, data: bold, weight: 700, style: "normal" });
  if (regular) fonts.push({ name: OG_FONT_FAMILY, data: regular, weight: 400, style: "normal" });

  let covered = new Set<string>();
  try {
    covered = new Set(
      Array.from(fs.readFileSync(path.join(ASSET_DIR, "charset.txt"), "utf8")),
    );
  } catch {
    /* no charset file — treat everything as missing */
  }

  const missing = [...ogCharset()].filter(
    (ch) => ch.charCodeAt(0) > 0x7e && !covered.has(ch),
  );

  if (!bold || missing.length > 0) {
    const text = bold ? missing.join("") : [...ogCharset()].join("");
    const extra = await fetchGoogleSubset(text);
    if (extra) {
      fonts.push({ name: OG_FONT_FAMILY, data: extra, weight: 700, style: "normal" });
    } else if (missing.length) {
      warn(`${missing.length} glyph(s) not in the vendored subset: ${missing.slice(0, 40).join("")}`);
    }
  }

  return fonts;
}

async function fetchGoogleSubset(text: string): Promise<ArrayBuffer | null> {
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&text=" +
    encodeURIComponent(text);
  try {
    // No User-Agent on purpose: Node's default UA gets TTF, which satori reads.
    const cssRes = await fetch(cssUrl, { signal: AbortSignal.timeout(8000) });
    if (!cssRes.ok) return null;
    const url = (await cssRes.text()).match(/url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;
    const fontRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!fontRes.ok) return null;
    const buf = await fontRes.arrayBuffer();
    const magic = new DataView(buf).getUint32(0).toString(16);
    return magic === "10000" || magic === "4f54544f" ? buf : null;
  } catch {
    return null;
  }
}

function warn(reason: string) {
  console.warn(
    [
      "",
      "┌──────────────────────────────────────────────────────────────┐",
      "│ OG FONT: some characters will render as boxes on share cards │",
      "└──────────────────────────────────────────────────────────────┘",
      `  ${reason}`,
      "  Fix: run `python3 scripts/subset-og-font.py` to regenerate the subset,",
      "  or allow build-time access to fonts.googleapis.com.",
      "",
    ].join("\n"),
  );
}
