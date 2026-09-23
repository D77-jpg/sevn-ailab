"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sevn-theme";

type Theme = "light" | "dark";

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  // Follow the OS only while the visitor hasn't made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* storage blocked — fall through to following the system */
      }
      if (stored === "light" || stored === "dark") return;
      const next: Theme = e.matches ? "dark" : "light";
      apply(next);
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    apply(next);
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked — the toggle still works for this session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "切换到浅色主题" : "切换到深色主题"
      }
      title={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
      className="grid size-9 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-sunk hover:text-ink"
    >
      {/* Both icons are rendered and cross-faded so there is no layout shift
          and no icon "pop" when the theme resolves on the client. */}
      <span className="relative block size-[15px]">
        <svg
          viewBox="0 0 16 16"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          aria-hidden
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: theme === "dark" ? 0 : 1 }}
        >
          <circle cx="8" cy="8" r="3.1" />
          <path d="M8 1.1v1.6M8 13.3v1.6M1.1 8h1.6M13.3 8h1.6M3.1 3.1l1.1 1.1M11.8 11.8l1.1 1.1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1" />
        </svg>
        <svg
          viewBox="0 0 16 16"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: theme === "dark" ? 1 : 0 }}
        >
          <path d="M13.4 9.6A5.9 5.9 0 0 1 6.4 2.6a5.9 5.9 0 1 0 7 7Z" />
        </svg>
      </span>
    </button>
  );
}
