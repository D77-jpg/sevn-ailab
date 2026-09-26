/**
 * The editorial rating, shown as five half-steppable dots.
 *
 * Deliberately not stars: this is one person's opinion, and stars carry a
 * "consumer review" connotation the site has not earned. The number is always
 * rendered alongside the dots so the value is readable without relying on
 * colour or shape.
 */
export function Rating({
  value,
  size = "md",
}: {
  value: number;
  /** `sm` for dense rows, `md` for the detail page. */
  size?: "sm" | "md";
}) {
  const dot = size === "sm" ? "h-[7px] w-[7px]" : "h-[9px] w-[9px]";

  return (
    <span className="flex items-center gap-2.5" title={`${value} / 5`}>
      <span aria-hidden className="flex gap-[3px]">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.min(1, Math.max(0, value - i));
          return (
            <span
              key={i}
              className={`block rounded-full ${dot}`}
              style={{
                background:
                  fill >= 1
                    ? "var(--accent)"
                    : fill > 0
                      ? `color-mix(in oklab, var(--accent) ${fill * 100}%, var(--line-strong))`
                      : "var(--line-strong)",
              }}
            />
          );
        })}
      </span>
      <span className={`mono text-ink ${size === "sm" ? "" : "text-[15px]"}`}>
        {value.toFixed(1)}
      </span>
      <span className="sr-only">满分 5 分</span>
    </span>
  );
}
