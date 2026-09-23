/**
 * Build a minimal, self-hosted subset of the CJK serif used for headings.
 *
 * The problem this solves: `next/font/google` emits a CJK family as dozens of
 * `unicode-range` slices, and the browser fetches every slice that covers a
 * character on the page. Measured on this site that was ~1 MB of fonts on the
 * home page — 80% of total transfer — because Chinese body text spans a wide
 * range of blocks. The slicing only pays off when a page uses a narrow range of
 * characters, which is not the case for prose.
 *
 * The insight that makes a subset viable: the serif face is only used for
 * **headings, blockquotes and lead paragraphs** (`.prose p` inherits the sans
 * stack). Those are short, so the character set is small — a few hundred
 * glyphs rather than a few thousand.
 *
 * Rather than guess that set from source, this drives a real browser, walks
 * every element, and keeps the text of those whose computed `font-family`
 * actually resolves to the webfont. Exact, and it keeps working when the
 * markup changes.
 *
 * Writes:
 *   src/fonts/noto-serif-sc-500.woff2
 *   src/fonts/noto-serif-sc-600.woff2
 *   src/fonts/charset.txt     (drift check + human inspection)
 *
 * Usage:
 *   BASE=http://localhost:4321 PW_ROOT=/path/to/scratch node subset-heading-font.mjs
 *
 * Env:
 *   BASE     origin to crawl        (default http://localhost:4321)
 *   OUT      output dir             (default <project>/src/fonts)
 *   CHROME   Chromium binary
 *   PW_ROOT  dir containing node_modules
 *   WEIGHTS  comma-separated        (default 500,600)
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const requireFrom = process.env.PW_ROOT
  ? createRequire(path.join(process.env.PW_ROOT, "__resolve__.cjs"))
  : createRequire(import.meta.url);
const { chromium } = requireFrom("playwright-core");

const BASE = (process.env.BASE ?? "http://localhost:4321").replace(/\/$/, "");
const OUT = process.env.OUT ?? "src/fonts";
const WEIGHTS = (process.env.WEIGHTS ?? "500,600").split(",").map((s) => s.trim());

/** A current Chrome UA, so Google Fonts serves woff2 (not TTF/EOT). */
const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function findChrome() {
  if (process.env.CHROME && fs.existsSync(process.env.CHROME)) return process.env.CHROME;
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "ms-playwright"),
    process.env.HOME && path.join(process.env.HOME, ".cache", "ms-playwright"),
    process.env.HOME &&
      path.join(process.env.HOME, "Library", "Caches", "ms-playwright"),
  ].filter(Boolean);
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const d of fs
      .readdirSync(root)
      .filter((x) => x.startsWith("chromium"))
      .sort()
      .reverse()) {
      for (const rel of [
        "chrome-win64/chrome.exe",
        "chrome-linux/chrome",
        "chrome-mac/Chromium.app/Contents/MacOS/Chromium",
      ]) {
        const p = path.join(root, d, rel);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return undefined;
}

// ── 1. discover every route from the sitemap, plus the filtered views ──────
const routes = new Set(["/"]);
try {
  const sm = await (await fetch(BASE + "/sitemap.xml")).text();
  for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    routes.add(m[1].replace(/^https?:\/\/[^/]+/, "") || "/");
  }
} catch {
  console.warn("sitemap unavailable; falling back to the static routes");
  for (const r of ["/", "/writing", "/projects", "/resources", "/about"]) routes.add(r);
}
// Filtered list views are not in the sitemap but render the same headings.
for (const c of ["vibe-coding", "agent", "ai-products"]) {
  routes.add(`/writing?c=${c}`);
}

// ── 2. collect the characters actually drawn in the serif face ─────────────
const browser = await chromium.launch({ executablePath: findChrome() });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const collected = new Set();
const usedWeights = new Set();
const perRoute = [];

for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });

  const text = await page.evaluate(() => {
    // next/font exposes the generated family name through the CSS variable.
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-noto-serif-sc")
      .trim();
    // e.g. `__Noto_Serif_SC_e8b7d3, __Noto_Serif_SC_Fallback_e8b7d3`
    const primary = family.split(",")[0].replace(/['"]/g, "").trim();

    const out = [];
    const weights = [];
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (!cs.fontFamily.includes(primary)) continue;
      // Own text only — descendants are visited on their own turn, so using
      // textContent here would duplicate and inflate the set.
      let own = "";
      for (const node of el.childNodes) {
        if (node.nodeType === 3) own += node.nodeValue;
      }
      if (!own) continue;
      out.push(own);
      // Only CJK needs this face; Latin resolves to Newsreader. Recording the
      // weight lets us flag a weight that is in use but has no subset file.
      if (/[\u3400-\u4dbf\u4e00-\u9fff]/.test(own)) weights.push(cs.fontWeight);
    }
    return { primary, text: out.join(""), weights };
  });

  for (const w of text.weights) usedWeights.add(w);

  const chars = [...new Set(text.text.replace(/\s/g, ""))];
  for (const c of chars) collected.add(c);
  perRoute.push({ route, family: text.primary, count: chars.length });
  console.log(`  ${String(chars.length).padStart(4)} chars  ${route}`);
}

console.log(`\nfont family resolved to: ${perRoute[0]?.family}`);

// ── 3. round out the set ───────────────────────────────────────────────────
// ASCII covers Latin that falls back here when Newsreader is unavailable, and
// the punctuation is what the design actually draws. Cheap insurance.
const EXTRA =
  Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("") +
  "·—–…／｜|：、，。！？（）【】《》“”‘’" +
  "0123456789";

for (const c of EXTRA) collected.add(c);

const charset = [...collected].sort().join("");
const cjk = charset.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) ?? [];
console.log(`charset: ${charset.length} chars (${cjk.length} CJK)`);

await ctx.close();
await browser.close();

// ── 4. fetch woff2 subsets ─────────────────────────────────────────────────
fs.mkdirSync(OUT, { recursive: true });

for (const weight of WEIGHTS) {
  const url =
    `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@${weight}` +
    `&text=${encodeURIComponent(charset)}`;

  const cssRes = await fetch(url, { headers: { "User-Agent": CHROME_UA } });
  if (!cssRes.ok) {
    console.error(`  weight ${weight}: css2 returned ${cssRes.status} — kept the existing file`);
    continue;
  }
  const css = await cssRes.text();
  const fontUrl = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!fontUrl) {
    console.error(`  weight ${weight}: no font url in the css — kept the existing file`);
    continue;
  }

  const fontRes = await fetch(fontUrl, { headers: { "User-Agent": CHROME_UA } });
  const buf = Buffer.from(await fontRes.arrayBuffer());

  // woff2 magic is "wOF2".
  if (buf.subarray(0, 4).toString() !== "wOF2") {
    console.error(
      `  weight ${weight}: expected woff2, got ${buf.subarray(0, 4).toString()} — kept the existing file`,
    );
    continue;
  }

  const file = path.join(OUT, `noto-serif-sc-${weight}.woff2`);
  fs.writeFileSync(file, buf);
  console.log(`  weight ${weight}: ${(buf.length / 1024).toFixed(1)} KB -> ${file}`);
}

fs.writeFileSync(path.join(OUT, "charset.txt"), charset + "\n", "utf8");
console.log(`charset written to ${path.join(OUT, "charset.txt")}`);

// ── 5. flag weights in use that have no subset ─────────────────────────────
//
// A weight with no face does not fall back to a *system* font — the browser
// picks the nearest declared weight instead. So it fails quietly, as a heading
// that is slightly heavier or lighter than the CSS says. Worth knowing.
const missingWeights = [...usedWeights].filter((w) => !WEIGHTS.includes(w));
console.log(`\nweights used by CJK serif elements: ${[...usedWeights].sort().join(", ")}`);
console.log(`weights with a subset:             ${WEIGHTS.join(", ")}`);
if (missingWeights.length) {
  console.log(
    `\n  NOTE  ${missingWeights.join(", ")} is in use but has no subset file.\n` +
      `        Those elements render with the nearest available weight.\n` +
      `        Add it to WEIGHTS and to the localFont() src in src/app/layout.tsx,\n` +
      `        or set the weight explicitly in CSS.`,
  );
}
