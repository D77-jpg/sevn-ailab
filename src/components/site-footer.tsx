import Link from "next/link";

import { BackToTop } from "@/components/back-to-top";
import { categories, nav, site, socials } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-8 border-t border-line bg-paper-deep">
      <div className="shell">
        {/* Statement */}
        <div className="grid gap-8 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:py-16">
          <div>
            <p className="eyebrow">SEVN AILAB</p>
            <p className="mt-4 max-w-[22ch] font-serif text-h2 leading-[1.12] text-ink">
              把想法做成
              <br />
              真正能跑起来的产品。
            </p>
            <p className="mt-5 max-w-[46ch] text-[15px] text-muted">
              {site.core.join(" · ")} — 一个公开的 AI 实验室。
              内容、项目与资源都在这里沉淀，社媒只负责把人带过来。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
            <div>
              <p className="mono-xs">导航</p>
              <ul className="mt-3 space-y-0.5">
                <li>
                  <Link
                    href="/"
                    className="inline-block py-2 text-[14px] text-muted transition-colors duration-200 hover:text-ink"
                  >
                    首页
                  </Link>
                </li>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block py-2 text-[14px] text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mono-xs">分类</p>
              <ul className="mt-3 space-y-0.5">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/writing?c=${c.slug}`}
                      className="inline-block py-2 text-[14px] text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/rss.xml"
                    className="inline-block py-2 text-[14px] text-muted transition-colors duration-200 hover:text-ink"
                  >
                    RSS
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social — listed with what actually gets published there */}
        <div className="border-t border-line py-8">
          <p className="mono-xs">分发渠道</p>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="group flex items-baseline justify-between gap-4 border-b border-line py-2.5"
                >
                  <span className="text-[14px] text-ink-2 transition-colors duration-200 group-hover:text-accent">
                    {s.label}
                  </span>
                  <span className="mono-xs shrink-0 text-right">{s.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Colophon */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line py-6">
          <p className="mono-xs">
            © {year} {site.name} · {site.domain}
          </p>
          <p className="mono-xs">
            Next.js · TypeScript · Tailwind · MDX
          </p>
          <BackToTop />
        </div>

        {/* Oversized wordmark — the magazine colophon page. Pure print
            furniture: faint ink, no interaction, aria-hidden. */}
        <div className="overflow-hidden border-t border-line pt-6 pb-2">
          <p aria-hidden className="wordmark">
            SEVN&nbsp;<em>AILAB</em>
          </p>
        </div>
      </div>
    </footer>
  );
}
