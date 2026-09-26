/**
 * Palette for generated OG images.
 *
 * `ImageResponse` renders through satori, which has no access to CSS custom
 * properties — every value has to be a literal. These mirror the light-theme
 * tokens in `globals.css` (V3). If that palette changes, update these too.
 */
export const OG_PALETTE = {
  paper: "#f5f5f7",
  surface: "#ffffff",
  ink: "#1d1d1f",
  ink2: "#3a3a3c",
  muted: "#6e6e73",
  faint: "#86868b",
  line: "#d2d2d7",
  accent: "#0071e3",
} as const;
