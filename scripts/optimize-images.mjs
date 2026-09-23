/**
 * Pre-encode responsive AVIF / WebP variants of the hero photo.
 *
 * A static export has no image optimizer (`images.unoptimized`), so the
 * variants live in `public/` and are picked by a <picture> element in the
 * homepage hero. Re-run after replacing `public/hero-desk.jpg`:
 *
 *   npm run images
 *
 * `sharp` ships with Next.js, so there is nothing extra to install.
 */
import path from "node:path";
import sharp from "sharp";

const SRC = path.join("public", "hero-desk.jpg");
const WIDTHS = [828, 1672];

for (const w of WIDTHS) {
  const base = sharp(SRC).resize({ width: w, withoutEnlargement: true });
  await base.clone().avif({ quality: 50, effort: 6 }).toFile(`public/hero-desk-${w}.avif`);
  await base.clone().webp({ quality: 72 }).toFile(`public/hero-desk-${w}.webp`);
  console.log(`hero-desk-${w}.{avif,webp}`);
}
