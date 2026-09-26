import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { crossLink, SectionLabel } from "@sevn/ui";

import { ConsultBuilder } from "@/components/consult-builder";
import { Dots } from "@/components/topic-row";
import { contact, referral, sister } from "@/lib/site";
import { difficultyLabel, directions, getTopic, topics } from "@/lib/topics";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  // Long-tail landing pages: "RAG 毕业设计", "MCP 毕设" … the direction goes
  // into the <title> so the page matches how students actually search.
  return {
    title: `${topic.title}｜${directions[topic.direction]}毕业设计`,
    description: `${topic.summary} 难度${difficultyLabel[topic.difficulty]}，工期 ${topic.weeks}。`,
    alternates: { canonical: `/topics/${topic.slug}/` },
    openGraph: { url: `/topics/${topic.slug}/`, title: topic.title, description: topic.summary },
  };
}

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const specs: [string, React.ReactNode][] = [
    ["方向", directions[topic.direction]],
    [
      "难度",
      <>
        <Dots level={topic.difficulty} /> {difficultyLabel[topic.difficulty]}
      </>,
    ],
    ["工期", topic.weeks],
    ["技术栈", topic.stack.join(" · ")],
    ["适合谁", topic.audience],
    ["最容易翻车", topic.pitfall],
  ];

  return (
    <article>
      <header className="section pb-0">
        <div className="shell">
          <Link
            href="/#topics"
            className="mono group inline-flex items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
          >
            <span aria-hidden className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
              ←
            </span>
            选题库
          </Link>
          <h1 className="mt-6 max-w-[24ch] font-serif text-h1 text-ink">{topic.title}</h1>
          <p className="mt-6 max-w-[62ch] text-lead text-muted">{topic.summary}</p>
        </div>
      </header>

      {/* Spec sheet — the same unified fields as every other topic */}
      <section className="section pt-12 pb-0">
        <div className="shell">
          <dl className="max-w-[68ch] border-t border-line">
            {specs.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6">
                <dt className={`mono-xs pt-[0.2em] ${k === "最容易翻车" ? "text-build" : ""}`}>{k}</dt>
                <dd className="text-[15px] leading-relaxed text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section pb-0">
        <div className="shell max-w-[calc(68ch+3rem)]">
          <SectionLabel>为什么值得做</SectionLabel>
          <p className="mt-6 text-[1.0625rem] leading-[1.8] text-ink-2">{topic.why}</p>
        </div>
      </section>

      <section className="section pb-0">
        <div className="shell">
          <SectionLabel>范围</SectionLabel>
          <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            <ScopeList label="必做：做完这些就能毕业" items={topic.must} accent />
            <ScopeList label="加分：时间有余再做" items={topic.plus} />
          </div>
        </div>
      </section>

      <section className="section pb-0">
        <div className="shell">
          <SectionLabel>创新点怎么写</SectionLabel>
          <p className="mt-6 max-w-[62ch] text-[15px] text-muted">
            三件套：一个具体的问题、一个你做的处理、一个能量出来的结果。缺一样都会在答辩时被追问。
            <Link href="/kadian/innovation-point/" className="link-wipe ml-1 text-ink-2">
              为什么是这三样
            </Link>
          </p>
          <ol className="mt-6 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {[
              ["问题", topic.innovation.problem],
              ["你的处理", topic.innovation.approach],
              ["可测的结果", topic.innovation.measure],
            ].map(([k, v], i) => (
              <li key={k} className="bg-paper p-6">
                <p className="mono-xs">
                  <span className="text-accent">{i + 1}</span> {k}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pb-0">
        <div className="shell">
          <SectionLabel>验证方案</SectionLabel>
          <p className="mt-6 max-w-[62ch] text-[15px] text-muted">
            开题时还没有结果，但这三行可以直接写进开题报告的「研究方法」。
          </p>
          <dl className="mt-6 max-w-[68ch] border-t border-line">
            {[
              ["基线", topic.evaluation.baseline],
              ["指标", topic.evaluation.metric],
              ["测试集", topic.evaluation.dataset],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6">
                <dt className="mono-xs pt-[0.2em]">{k}</dt>
                <dd className="text-[15px] leading-relaxed text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {topic.origin && (
        <section className="section pb-0">
          <div className="shell">
            <a
              href={crossLink(`${sister.url}${topic.origin.path}`, {
                from: "gradlab",
                medium: "topic_detail",
                content: topic.slug,
              })}
              className="group block max-w-[68ch] border-l-2 border-accent bg-surface px-6 py-5 transition-colors duration-200"
            >
              <p className="mono-xs">来自 SEVN AILAB 的真实项目</p>
              <p className="mt-2.5 text-[1.0625rem] leading-snug font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                {topic.origin.label}：完整的技术实现与复盘 ↗
              </p>
              {topic.origin.fact && (
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{topic.origin.fact}</p>
              )}
            </a>
          </div>
        </section>
      )}

      <section id="consult" className="section">
        <div className="shell">
          <SectionLabel>想做这个题目</SectionLabel>
          <div className="mt-8">
            <ConsultBuilder
              wechat={contact.wechat}
              email={contact.email}
              referral={referral}
              topicTitle={topic.title}
            />
          </div>
        </div>
      </section>
    </article>
  );
}

function ScopeList({ label, items, accent }: { label: string; items: string[]; accent?: boolean }) {
  return (
    <div className="bg-paper p-6 md:p-7">
      <p className={`mono-xs ${accent ? "text-accent" : ""}`}>{label}</p>
      <ul className="mt-4 space-y-3">
        {items.map((x) => (
          <li key={x} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
            <span
              aria-hidden
              className={`mt-[0.7em] block size-[6px] shrink-0 rounded-full ${accent ? "bg-accent" : "bg-line-strong"}`}
            />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}
