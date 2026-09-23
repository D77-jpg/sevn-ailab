"use client";

import { useEffect, useState } from "react";

import type { Heading } from "@/lib/toc";

/**
 * Tracks which section the reader is in: the last heading whose top has
 * passed the upper ~30% of the viewport.
 *
 * A rAF-throttled scroll listener rather than an IntersectionObserver: IO only
 * reports *changes* in intersection, so a jump (anchor click, reload halfway
 * down, End key) that carries headings straight past the observed band fires
 * nothing and leaves the highlight stale.
 */
function useActiveHeading(key: string) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = key
      .split("\n")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    let raf = 0;
    const pick = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return active;
}

function TocList({
  headings,
  active,
  onNavigate,
}: {
  headings: Heading[];
  active: string | null;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {headings.map((h) => {
        const current = h.id === active;
        return (
          <li key={h.id} style={{ paddingLeft: h.depth === 3 ? "0.875rem" : 0 }}>
            <a
              href={`#${h.id}`}
              onClick={onNavigate}
              aria-current={current ? "location" : undefined}
              className={`relative block py-1.5 pl-3 text-[13px] leading-snug transition-colors duration-200 ${
                current ? "text-ink" : "text-muted hover:text-accent"
              }`}
            >
              <span
                aria-hidden
                className="absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-full transition-colors duration-200"
                style={{ background: current ? "var(--accent)" : "transparent" }}
              />
              {h.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Sticky sidebar TOC for wide screens. */
export function TocSidebar({ headings }: { headings: Heading[] }) {
  const active = useActiveHeading(headings.map((h) => h.id).join("\n"));
  return (
    <nav aria-label="本文目录" className="sticky top-28">
      <p className="mono-xs border-b border-line pb-3">目录</p>
      <div className="mt-3 -ml-3">
        <TocList headings={headings} active={active} />
      </div>
    </nav>
  );
}

/** Collapsible TOC shown above the article body below the `lg` breakpoint. */
export function TocInline({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  const active = useActiveHeading(headings.map((h) => h.id).join("\n"));

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="group mb-10 rounded-md border border-line bg-surface lg:hidden"
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 [&::-webkit-details-marker]:hidden">
        <span className="mono-xs">本文目录 · {headings.length} 节</span>
        <span
          aria-hidden
          className="text-faint transition-transform duration-300 group-open:rotate-180"
        >
          ↓
        </span>
      </summary>
      <div className="border-t border-line px-5 py-3">
        <TocList
          headings={headings}
          active={active}
          onNavigate={() => setOpen(false)}
        />
      </div>
    </details>
  );
}
