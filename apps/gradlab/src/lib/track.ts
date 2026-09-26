/**
 * Fire an analytics event. A no-op unless an analytics script is loaded
 * (see `analytics` in site.ts), so calling it is always safe.
 */
type Hmt = { push: (args: unknown[]) => void };

export function track(event: string, label?: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { _hmt?: Hmt };
  w._hmt?.push(["_trackEvent", "gradlab", event, label ?? ""]);
}
