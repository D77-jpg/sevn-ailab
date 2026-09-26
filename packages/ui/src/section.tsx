import Link from "next/link";

/** Lifecycle states shared by both sites (projects on AILAB, articles on GRADLAB). */
export type StatusState = "shipped" | "building" | "research";

/**
 * The hairline section label (`01 / WRITING ────────`).
 *
 * Renders as a real <h2> so the heading outline stays h1 → h2 → h3. Without
 * this the list pages went straight from the page <h1> to the h3 card titles,
 * which breaks screen-reader heading navigation (WCAG 1.3.1).
 *
 * Nothing changes visually: `.eyebrow` sets its own font/size/weight, and
 * preflight already zeroes the heading margin.
 */
export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`rule ${className}`}>
      <span className="eyebrow">
        {index && <span className="text-accent">{index}</span>}
        {index && (
          <span aria-hidden className="mx-2 text-faint">
            /
          </span>
        )}
        {children}
      </span>
    </h2>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  action,
}: {
  index?: string;
  label: string;
  title?: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  // When there's no visible `title`, the label itself has to carry the heading
  // semantics — otherwise this block contributes no <h2> to the outline.
  const LabelTag = (title ? "div" : "h2") as "div" | "h2";

  return (
    <div className="mb-10">
      <LabelTag className="rule">
        <span className="eyebrow">
          {index && <span className="text-accent">{index}</span>}
          {index && (
          <span aria-hidden className="mx-2 text-faint">
            /
          </span>
        )}
          {label}
        </span>
        {action && (
          <Link
            href={action.href}
            className="mono group inline-flex shrink-0 items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
          >
            {action.label}
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
              style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            >
              →
            </span>
          </Link>
        )}
      </LabelTag>

      {(title || description) && (
        <div className="grid gap-x-12 gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-end">
          {title && (
            <h2 className="max-w-[20ch] font-serif text-h2 text-ink">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[15px] text-muted md:pb-1.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function StatusPill({
  state,
  label,
}: {
  state: StatusState;
  label: string;
}) {
  return (
    <span className="status" data-state={state}>
      {label}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="section pb-10 md:pb-14">
      <div className="shell">
        <p className="eyebrow rise" style={{ animationDelay: "0ms" }}>
          {eyebrow}
        </p>
        <h1
          className="rise mt-5 max-w-[24ch] font-serif text-h1 text-ink"
          style={{ animationDelay: "70ms" }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="rise mt-6 max-w-[62ch] text-lead text-muted"
            style={{ animationDelay: "140ms" }}
          >
            {lead}
          </p>
        )}
        {meta && (
          <div className="rise mt-8" style={{ animationDelay: "210ms" }}>
            {meta}
          </div>
        )}
      </div>
    </div>
  );
}

export function Empty({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="border border-dashed border-line-strong px-6 py-16 text-center">
      <p className="text-[15px] text-ink-2">{children}</p>
      {hint && <p className="mono-xs mt-3">{hint}</p>}
    </div>
  );
}
