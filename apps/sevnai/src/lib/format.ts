/**
 * Date formatting shared by server and client components.
 *
 * Lives apart from `writing.ts` because that module reads the filesystem —
 * importing it from a client component would drag `node:fs` into the browser
 * bundle and fail the build.
 */

/** "2026-09-14" -> "2026.09.14" — the datasheet-style date used across the UI. */
export function formatDate(iso: string): string {
  return iso.replace(/-/g, ".");
}

/** "2026-09-14" -> "2026 年 9 月 14 日" */
export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}
