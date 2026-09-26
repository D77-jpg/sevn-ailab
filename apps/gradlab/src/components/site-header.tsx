"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { crossLink, Mark, ThemeToggle } from "@sevn/ui";

import { nav, site, sister } from "@/lib/site";

/**
 * Same skeleton as the AILAB header — mark, wordmark, centred nav, utilities —
 * so the two read as one family. The one addition is the site switcher: a
 * quiet link to the sister site, present on both headers.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sisterHref = crossLink(sister.url, { from: "gradlab", medium: "header" });

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
            className="flex items-center gap-2.5 py-2"
            aria-label={`${site.name} 首页`}
          >
            <Mark />
            <span className="text-[15px] leading-none font-semibold tracking-[-0.02em] text-ink">
              SEVN
              <span className="ml-[0.35em] font-normal text-faint">GRADLAB</span>
            </span>
          </Link>
        </div>

        <nav aria-label="主导航" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => {
            const active = item.href === "/kadian/" && pathname.startsWith("/kadian");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-[14px] tracking-[-0.005em] transition-colors duration-200 ${
                  active ? "font-medium text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1.5">
          <a
            href={sisterHref}
            className="mono-xs hidden rounded-full px-3 py-2 text-muted transition-colors duration-200 hover:bg-surface-sunk hover:text-ink sm:inline-flex"
            title="SEVN AILAB：作者的 AI 实验室"
          >
            AILAB ↗
          </a>

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
                  transform: open ? "translateY(5px) rotate(45deg)" : "none",
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                }}
              />
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300"
                style={{
                  transform: open ? "translateY(-5px) rotate(-45deg)" : "none",
                  transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line md:hidden"
        style={{ backgroundColor: "var(--paper)" }}
      >
        <nav aria-label="移动导航" className="shell pt-4 pb-6">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="drawer-item flex items-baseline gap-4 border-b border-line py-4"
              style={{ animationDelay: `${60 + i * 55}ms` }}
            >
              <span className="mono-xs w-6 shrink-0 text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-[1.75rem] leading-tight tracking-[-0.02em] text-ink-2">
                {item.label}
              </span>
            </Link>
          ))}
          <div
            className="drawer-item flex items-center justify-between gap-4 pt-5"
            style={{ animationDelay: `${60 + nav.length * 55}ms` }}
          >
            <p className="mono-xs">{site.tagline}</p>
            <a
              href={sisterHref}
              className="mono-xs text-muted transition-colors duration-200 hover:text-accent"
            >
              SEVN AILAB ↗
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
