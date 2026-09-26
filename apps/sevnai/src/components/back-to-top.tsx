"use client";

/**
 * Footer "back to top". Kept as its own tiny client island so the footer
 * itself stays a server component.
 */
export function BackToTop({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`mono-xs cursor-pointer transition-colors duration-200 hover:text-accent ${className}`}
    >
      回到顶部 ↑
    </button>
  );
}
