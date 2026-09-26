import Link from "next/link";

import { nav, site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">404 / 页面不存在</p>
        <h1 className="mt-6 max-w-[20ch] font-serif text-h1 text-ink">
          这个页面不存在，或者还没写。
        </h1>
        <p className="mt-6 max-w-[52ch] text-lead text-muted">
          后者更可能。这个站点还在持续补充内容，有些入口先留了位置。
        </p>

        <nav className="mt-10 border-t border-line">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="spec-row group"
            >
              <span className="text-[1.0625rem] font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                {item.label}
              </span>
              <span className="mono-xs md:col-span-3 md:text-right">
                {item.hint}
              </span>
            </Link>
          ))}
        </nav>

        <Link href="/" className="btn btn-secondary mt-10">
          回到首页
        </Link>

        <p className="mono-xs mt-12">{site.domain}</p>
      </div>
    </section>
  );
}
