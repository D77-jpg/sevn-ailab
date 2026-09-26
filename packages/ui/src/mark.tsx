/**
 * The logo square: an ink tile with a single dot in the site's accent colour.
 *
 * This dot is the whole brand difference between the two sites — blue on
 * SEVN AILAB, green on SEVN GRADLAB — because `bg-accent` resolves to each
 * site's own `--accent`.
 */
export function Mark({ size = 20 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative grid shrink-0 place-items-center rounded-[6px] bg-ink"
      style={{ width: size, height: size }}
    >
      <span
        className="block rounded-full bg-accent"
        style={{ width: size * 0.3, height: size * 0.3 }}
      />
    </span>
  );
}
