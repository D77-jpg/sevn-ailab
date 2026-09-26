"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { nav, site, socials } from "@/lib/site";
import { SearchDialog } from "@/components/search";
import { Mark, ThemeToggle } from "@sevn/ui";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      setLifted(window.scrollY > 8);
      // Drive the progress rule via a CSS variable straight on the node —
      // scrolling at 120Hz must not re-render the header.
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = progressRef.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        el.style.setProperty("--progress", String(p));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const github = socials.find((s) => s.label === "GitHub");

  return (
    <header
      className="sticky top-0 z-40 border-b border-line"
      style={{
        backgroundColor: "color-mix(in oklab, var(--paper) 82%, transparent)",
        backdropFilter: "blur(20px) saturate(1.8)",
        WebkitBackdropFilter: "blur(20px) saturate(1.8)",
        boxShadow: lifted ? "var(--shadow-1)" : "none",
        transition: "box-shadow .25s var(--ease-out-quart)",
      }}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center">
          <Link
            href="/"
            className="group flex items-center gap-2.5 py-2"
            aria-label={`${site.name} 首页`}
          >
            <Mark />
            <span className="text-[15px] leading-none font-semibold tracking-[-0.02em] text-ink">
              SEVN
              <span className="ml-[0.35em] font-normal text-faint">AILAB</span>
            </span>
          </Link>
        </div>

        <nav
          aria-label="主导航"
          className="hidden items-center gap-7 md:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative py-2 text-[14px] tracking-[-0.005em] transition-colors duration-200 ${
                isActive(item.href)
                  ? "font-medium text-ink"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  className="absolute inset-x-0 -bottom-[1px] h-px origin-left bg-ink"
                  style={{
                    animation: "draw-line .5s cubic-bezier(.16,1,.3,1) both",
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5">
          <SearchDialog />

          {github && (
            <a
              href={github.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden size-9 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-sunk hover:text-ink sm:grid"
              aria-label="GitHub"
            >
              <svg
                viewBox="0 0 16 16"
                width="15"
                height="15"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
            </a>
          )}

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-sunk hover:text-ink md:hidden"
          >
            <span className="relative block h-[11px] w-[17px]">
              <span
                className="absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300"
                style={{
                  transform: open
                    ? "translateY(5px) rotate(45deg)"
                    : "translateY(0) rotate(0)",
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                }}
              />
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300"
                style={{
                  transform: open
                    ? "translateY(-5px) rotate(-45deg)"
                    : "translateY(0) rotate(0)",
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer — an editorial index page, not a condensed navbar.
          Serif display links with mono indices; items stagger in on open. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line md:hidden"
        style={{
          backgroundColor: "var(--paper)",
        }}
      >
        <nav aria-label="移动导航" className="shell pt-4 pb-6">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="drawer-item group flex items-baseline gap-4 border-b border-line py-4"
              style={{ animationDelay: `${60 + i * 55}ms` }}
            >
              <span className="mono-xs w-6 shrink-0 text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`font-serif text-[1.75rem] leading-tight tracking-[-0.02em] ${
                  isActive(item.href) ? "text-ink" : "text-ink-2"
                }`}
              >
                {item.label}
              </span>
              {item.hint && (
                <span className="mono-xs ml-auto shrink-0 text-right">
                  {item.hint}
                </span>
              )}
            </Link>
          ))}

          <div
            className="drawer-item flex items-center justify-between gap-4 pt-5"
            style={{ animationDelay: `${60 + nav.length * 55}ms` }}
          >
            <p className="mono-xs">{site.tagline}</p>
            {github && (
              <a
                href={github.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mono-xs text-muted transition-colors duration-200 hover:text-accent"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </nav>
      </div>

      {/* Reading progress along the header's bottom edge */}
      <div ref={progressRef} aria-hidden className="scroll-progress" />
    </header>
  );
}
