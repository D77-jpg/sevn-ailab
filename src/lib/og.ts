/**
 * Palette for generated OG images.
 *
 * `ImageResponse` renders through satori, which has no access to CSS custom
 * properties — every value has to be a literal. These are the light-theme
 * design tokens converted to sRGB. If the light palette in `globals.css`
 * changes, update these too.
 */
export const OG_PALETTE = {
  paper: "#faf8f4",
  paperDeep: "#f3f0eb",
  surface: "#fefdfb",
  ink: "#1d1914",
  ink2: "#37322c",
  muted: "#554f48",
  faint: "#6d6862",
  line: "#e1deda",
  lineStrong: "#cfcbc6",
  accent: "#1c5c9e",
  accentSoft: "#ebf4ff",
} as const;
