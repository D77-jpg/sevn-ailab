import Link from "next/link";

import { crossLink } from "@sevn/ui";

import { contact, sister, site } from "@/lib/site";
import { topics } from "@/lib/topics";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] mt-8 border-t border-line bg-paper-deep">
      <div className="shell">
        <div className="grid gap-8 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:py-16">
          <div>
            <p className="eyebrow">SEVN GRADLAB</p>
            <p className="mt-4 max-w-[22ch] font-serif text-h2 leading-[1.12] text-ink">
              代码你写，论文你写，
              <br />
              答辩你讲。
            </p>
            <p className="mt-5 max-w-[46ch] text-[15px] text-muted">
              {site.tagline}。SEVN AILAB 的姊妹站：那边记录完整的工程实践，这里讲怎么把它收窄成一个本科做得完、答辩讲得清的题目。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mono-xs">选题</p>
              <ul className="mt-3 space-y-0.5">
                {topics.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/topics/${t.slug}/`}
                      className="inline-block py-1.5 text-[14px] leading-snug text-muted transition-colors duration-200 hover:text-ink"
                    >
                      {t.title.replace(/（.*）$/, "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono-xs">站点</p>
              <ul className="mt-3 space-y-0.5">
                <li>
                  <Link href="/kadian/" className="inline-block py-1.5 text-[14px] text-muted transition-colors duration-200 hover:text-ink">
                    卡点文章
                  </Link>
                </li>
                <li>
                  <Link href="/#boundary" className="inline-block py-1.5 text-[14px] text-muted transition-colors duration-200 hover:text-ink">
                    服务边界
                  </Link>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className="inline-block py-1.5 text-[14px] text-muted transition-colors duration-200 hover:text-ink">
                    {contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sister site — the same line sits in the AILAB footer, pointing here */}
        <div className="border-t border-line py-6">
          <a
            href={crossLink(sister.url, { from: "gradlab", medium: "footer" })}
            className="group flex items-baseline justify-between gap-4"
          >
            <span className="mono-xs">姊妹站</span>
            <span className="text-[14px] text-ink-2 transition-colors duration-200 group-hover:text-accent">
              {sister.name}：作者的 AI 实验室，项目与完整复盘 ↗
            </span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line py-6">
          <p className="mono-xs">
            © {year} {site.name} · {site.domain}
          </p>
          <p className="mono-xs">不代写 · 不代答辩 · 不买卖论文</p>
        </div>

        <div className="overflow-hidden border-t border-line pt-6 pb-2">
          <p aria-hidden className="wordmark wordmark--long">
            SEVN&nbsp;<em>GRADLAB</em>
          </p>
        </div>
      </div>
    </footer>
  );
}
