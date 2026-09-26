import Link from "next/link";

import { crossLink, SectionHeader } from "@sevn/ui";

import { ConsultBuilder } from "@/components/consult-builder";
import { KadianList } from "@/components/kadian-list";
import { TopicRow, TopicRowLegend } from "@/components/topic-row";
import { getKadianIndex } from "@/lib/kadian";
import { contact, referral, sister } from "@/lib/site";
import { topics } from "@/lib/topics";

/** 分工表：每一步写清「你来做」和「我帮你」。页面上唯一的「大动作」。 */
const division = [
  {
    stage: "选题",
    you: "说清你的兴趣、会的技术、离答辩还有多久。",
    me: "判断题目在你的时间里做不做得完，给出两三个收窄后的版本。",
  },
  {
    stage: "开题",
    you: "自己写开题报告。",
    me: "逐条批注创新点、研究方法和验证方案，指出会被导师追问的地方。",
  },
  {
    stage: "开发",
    you: "自己写代码、跑实验、整理数据。",
    me: "架构评审；卡住时一起排查；审阅你的代码，告诉你哪里答辩时说不清。",
  },
  {
    stage: "论文",
    you: "自己写论文。",
    me: "给结构建议，指出论证和数据上的漏洞。不改写、不润色成我的文字。",
  },
  {
    stage: "答辩",
    you: "自己讲。",
    me: "按导师的视角模拟答辩，把最可能的追问提前问一遍。",
  },
];

const canHelp = [
  "判断题目能否按期做完，收窄范围",
  "审开题报告里的创新点与验证方案",
  "架构评审、代码审阅、卡点排查",
  "设计评测集与对比实验",
  "模拟答辩与追问",
];

const wontDo = [
  "代写代码并交付",
  "代写、改写或「降重」论文",
  "代替答辩、代考",
  "买卖论文、伪造实验数据",
];

export default function HomePage() {
  const { published, planned } = getKadianIndex();
  const fromReal = topics.filter((t) => t.origin).length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="section pb-14 md:pb-20">
        <div className="shell">
          <p className="eyebrow rise">AI 方向毕业设计辅导</p>
          <h1
            className="rise mt-5 font-serif text-display text-ink"
            style={{ animationDelay: "70ms" }}
          >
            {/* Break only between phrases, never inside 「先判断」. */}
            <span className="inline-block">AI 毕设，</span>
            <span className="inline-block">先判断</span>
            <span className="inline-block">做不做得完。</span>
          </h1>
          <p
            className="rise mt-7 max-w-[56ch] text-lead text-muted"
            style={{ animationDelay: "140ms" }}
          >
            只做 RAG、Agent、AIGC 这类 AI 方向。每个题目都从真实跑过的项目里收窄而来：本科 8–12 周做得完，答辩时每个设计取舍你都讲得清。代码你写，论文你写，答辩你讲。
          </p>
          <div
            className="rise mt-9 flex flex-wrap gap-3"
            style={{ animationDelay: "210ms" }}
          >
            <Link href="#topics" className="btn btn-primary">
              看选题库
            </Link>
            <Link href="#consult" className="btn btn-secondary">
              写第一条消息
            </Link>
          </div>

          <figure
            className="rise mt-16 max-w-[62ch] border-l-2 border-accent bg-surface px-6 py-5 md:mt-20"
            style={{ animationDelay: "280ms" }}
          >
            <blockquote className="font-serif text-[1.25rem] leading-snug tracking-[-0.01em] text-ink md:text-[1.4rem]">
              能用代码判断的，绝不交给模型。
            </blockquote>
            <figcaption className="mt-3 text-[14px] leading-relaxed text-muted">
              这是我在{" "}
              <a
                href={crossLink(sister.url, { from: "gradlab", medium: "hero" })}
                className="link-wipe text-ink-2"
              >
                SEVN AILAB
              </a>{" "}
              做项目时最常写进构建日志的一句话。下面六个题目的创新点，都是它的一个具体应用。
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── 01 选题库 ─────────────────────────────────────────────────── */}
      <section id="topics" className="section pt-0">
        <div className="shell">
          <SectionHeader
            index="01"
            label="选题库"
            title="六个本科做得完的 AI 题目"
            description={`每个都写清了难度、工期、适合谁，以及最容易翻车的地方。其中 ${fromReal} 个改编自 SEVN AILAB 上真实跑过的项目和文章。`}
          />
          <TopicRowLegend />
          <div>
            {topics.map((t) => (
              <TopicRow key={t.slug} topic={t} />
            ))}
          </div>
          <p className="mt-6 max-w-[62ch] text-[14px] text-muted">
            没有你想做的？选题库只是起点。把你的想法发过来，我帮你判断能不能收窄成一个做得完的版本。
          </p>
        </div>
      </section>

      {/* ── 02 分工表 ─────────────────────────────────────────────────── */}
      <section id="division" className="section pt-0">
        <div className="shell">
          <SectionHeader
            index="02"
            label="分工"
            title="每一步，谁来做"
            description="辅导不是代做。下面这张表就是合作的全部约定：左边一列永远是你。"
          />
          <div className="border-t border-line">
            <div className="hidden border-b border-line py-2.5 md:grid md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8">
              <span className="mono-xs">阶段</span>
              <span className="mono-xs">你来做</span>
              <span className="mono-xs text-accent">我帮你</span>
            </div>
            {division.map((row) => (
              <div
                key={row.stage}
                className="grid gap-y-3 border-b border-line py-5 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8"
              >
                <p className="font-serif text-h3 text-ink">{row.stage}</p>
                <div>
                  <p className="mono-xs md:hidden">你来做</p>
                  <p className="mt-1 text-[1.0625rem] leading-relaxed font-medium text-ink md:mt-0">
                    {row.you}
                  </p>
                </div>
                <div>
                  <p className="mono-xs text-accent md:hidden">我帮你</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted md:mt-0">
                    {row.me}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 边界 ───────────────────────────────────────────────────── */}
      <section id="boundary" className="section pt-0">
        <div className="shell">
          <SectionHeader
            index="03"
            label="边界"
            title="能帮的，和不做的"
            description="说清楚不做什么，比说清楚做什么更重要。"
          />
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            <div className="bg-paper p-6 md:p-8">
              <p className="mono-xs text-accent">我帮你</p>
              <ul className="mt-4 space-y-3">
                {canHelp.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                    <span aria-hidden className="mt-[0.7em] block size-[6px] shrink-0 rounded-full bg-accent" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-paper p-6 md:p-8">
              <p className="mono-xs">我不做</p>
              <ul className="mt-4 space-y-3">
                {wontDo.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                    <span aria-hidden className="mt-[0.7em] block h-px w-[8px] shrink-0 bg-muted" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 max-w-[68ch] text-[14px] leading-relaxed text-muted">
            这不只是态度问题。2025 年 1 月 1 日起施行的《中华人民共和国学位法》规定，学位论文被认定存在代写、剽窃、伪造等学术不端行为的，已授予的学位可以被撤销。代做的风险最终落在你身上，而且没有期限。
          </p>
        </div>
      </section>

      {/* ── 04 卡点 ───────────────────────────────────────────────────── */}
      <section id="kadian" className="section pt-0">
        <div className="shell">
          <SectionHeader
            index="04"
            label="卡点"
            title="一篇只解决一个卡点"
            description="按毕设阶段写，适合收藏，也适合直接转给同样卡住的同学。"
            action={{ label: "全部卡点", href: "/kadian/" }}
          />
          <KadianList published={published} planned={planned} />
        </div>
      </section>

      {/* ── 05 作者 ───────────────────────────────────────────────────── */}
      <section id="author" className="section pt-0">
        <div className="shell">
          <SectionHeader index="05" label="作者" />
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-end">
            <h2 className="font-serif text-h2 text-ink">
              <span className="inline-block">我是 SEVN，</span>
              <br />
              <span className="inline-block">自己做项目，</span>
              <span className="inline-block">也带同学做。</span>
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-muted">
              <p>
                AI 独立开发者。在 SEVN AILAB 公开记录 Agent 与 AI 产品的完整构建过程：架构决策、返工和踩坑，而不只是成功的部分。
              </p>
              <p>
                选题库里的题目，大多是从那些项目里收窄出来的。你可以先去看原项目的复盘，再决定要不要找我。
              </p>
              <a
                href={crossLink(`${sister.url}/about`, { from: "gradlab", medium: "author" })}
                className="mono inline-flex items-center gap-1.5 py-2 text-ink-2 transition-colors duration-200 hover:text-accent"
              >
                去 SEVN AILAB 看项目 ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 咨询 ───────────────────────────────────────────────────── */}
      <section id="consult" className="section pt-0">
        <div className="shell">
          <SectionHeader
            index="06"
            label="咨询"
            title="点三下，写好第一条消息"
            description="第一个问题永远是「来不来得及」。选好这三项，复制后发给我，我会先告诉你能做到哪一步。"
          />
          <ConsultBuilder wechat={contact.wechat} email={contact.email} referral={referral} />
        </div>
      </section>
    </>
  );
}
