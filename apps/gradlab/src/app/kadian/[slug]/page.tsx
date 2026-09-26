import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, getAllKadian, getKadian, stages } from "@/lib/kadian";
import { renderMarkdown } from "@/lib/mdx";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllKadian().map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const k = getKadian(slug);
  if (!k) return {};
  return {
    title: k.title,
    description: k.summary,
    alternates: { canonical: `/kadian/${k.slug}/` },
    openGraph: { type: "article", url: `/kadian/${k.slug}/`, title: k.title, description: k.summary, publishedTime: k.date },
  };
}

export default async function KadianPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const k = getKadian(slug);
  if (!k) notFound();
  const content = await renderMarkdown(k.body);

  return (
    <article>
      <header className="section pb-0">
        <div className="shell">
          <Link
            href="/kadian/"
            className="mono group inline-flex items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
          >
            <span aria-hidden className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
              ←
            </span>
            卡点
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="mono-xs text-accent">{stages[k.stage]}</span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <time dateTime={k.date} className="mono-xs">
              {formatDate(k.date)}
            </time>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <span className="mono-xs">{k.readingMinutes} 分钟阅读</span>
          </div>
          <h1 className="mt-6 max-w-[26ch] font-serif text-h1 text-ink">{k.title}</h1>
          <p className="mt-6 max-w-[62ch] text-lead text-muted">{k.summary}</p>
          {k.takeaway && (
            <div className="mt-9 max-w-[62ch] border-l-2 border-accent bg-surface px-6 py-5">
              <p className="mono-xs">一句话结论</p>
              <p className="mt-2.5 font-serif text-[1.125rem] leading-snug text-ink">{k.takeaway}</p>
            </div>
          )}
        </div>
      </header>

      <div className="section pt-12">
        <div className="shell">
          <div className="prose max-w-[68ch]">{content}</div>

          <div className="mt-16 max-w-[68ch] border-t border-line pt-8">
            <p className="mono-xs">卡在这一步？</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              把你的题目和进度发给我，我先告诉你问题在哪、还来不来得及。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/#consult" className="btn btn-primary">
                写第一条消息
              </Link>
              <Link href="/#topics" className="btn btn-secondary">
                看选题库
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
