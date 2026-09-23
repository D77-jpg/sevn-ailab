import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { PageHero, SectionLabel } from "@/components/ui";
import { staticPageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema";
import { site, socials } from "@/lib/site";
import { getAllPosts } from "@/lib/writing";

export const metadata = staticPageMetadata({
  title: "关于",
  description:
    "SEVN AILAB 是一个公开的 AI 实验室。这里说明它在做什么、怎么写内容、以及接下来三个版本的计划。",
  path: "/about",
});

const pillars = [
  {
    n: "01",
    title: "Vibe Coding",
    body: "记录 AI 编程工具与真实开发过程。把复杂的技术决策拆成普通人也能理解的实践步骤。",
    tags: ["Claude Code", "Cursor", "Codex", "Cline"],
  },
  {
    n: "02",
    title: "Agent 开发",
    body: "从 Workflow、Tool Calling、MCP 到多 Agent 与企业数字员工，逐步建立专业壁垒。",
    tags: ["MCP", "Tool Calling", "Multi-Agent"],
  },
  {
    n: "03",
    title: "AI 产品",
    body: "把正在做的产品变成长期内容资产，而不是为了发内容而制造内容。",
    tags: ["Build in Public", "Case Study"],
  },
  {
    n: "04",
    title: "AI 资源",
    body: "沉淀模型、工具、开源项目与开发技巧，形成长期可持续的搜索流量入口。",
    tags: ["Tools", "Models", "Resources"],
  },
];

const pipeline = [
  { label: "真实项目", note: "Build in Public" },
  { label: "网站深度文章", note: "完整沉淀" },
  { label: "公众号 / 小红书", note: "观点 + 教程" },
  { label: "抖音 / B站", note: "视频化表达" },
  { label: "GitHub", note: "代码 + 开源" },
];

type RoadmapItem = { label: string; done?: boolean };

const roadmap: {
  version: string;
  title: string;
  status: string;
  items: RoadmapItem[];
}[] = [
  {
    version: "V1",
    title: "品牌站",
    status: "已上线",
    items: [
      { label: "首页", done: true },
      { label: "文章", done: true },
      { label: "项目 / 实验室", done: true },
      { label: "资源", done: true },
      { label: "关于", done: true },
      { label: "社媒入口", done: true },
    ],
  },
  {
    version: "V1.5",
    title: "内容增长",
    status: "进行中",
    items: [
      { label: "站内搜索", done: true },
      { label: "RSS", done: true },
      { label: "标签体系", done: true },
      { label: "邮件订阅" },
      { label: "更多 Case Study" },
    ],
  },
  {
    version: "V2",
    title: "数字产品",
    status: "计划中",
    items: [
      { label: "资源下载" },
      { label: "项目源码" },
      { label: "Prompt 合集" },
      { label: "模板" },
      { label: "小工具" },
    ],
  },
  {
    version: "V3",
    title: "商业化系统",
    status: "计划中",
    items: [
      { label: "系统课程" },
      { label: "会员" },
      { label: "训练营" },
      { label: "企业 Agent" },
      { label: "咨询" },
    ],
  },
];

const principles = [
  {
    title: "先做项目，再写内容",
    body: "内容从真实项目里长出来。没有项目支撑的教程，写出来自己都不想看第二遍。",
  },
  {
    title: "写失败的部分",
    body: "推倒重来的记录比成功经验更有用。每篇文章都保留「还没解决」那一节。",
  },
  {
    title: "确定性优先",
    body: "能用代码判断的，绝不交给模型。这个原则在每一个项目里都被验证过一次。",
  },
  {
    title: "不急着变现",
    body: "先用免费内容和真实项目建立信任。低客单产品只用来验证付费意愿，不用来赚钱。",
  },
];

export default function AboutPage() {
  const postCount = getAllPosts().length;
  const activeCount = projects.filter((p) => p.status !== "shipped").length;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          ["首页", "/"],
          ["关于", "/about"],
        ])}
      />
      <PageHero
        eyebrow="关于"
        title={
          <>
            这里不是教程网站，
            <br />
            是一个公开的 AI 实验室
          </>
        }
        lead="核心不是教别人，而是持续记录「如何用 AI 把一个想法变成真正能运行的产品」。内容、项目和商业化围绕同一件事展开。"
        meta={
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
            {[
              ["进行中项目", String(activeCount).padStart(2, "0")],
              ["已发布文章", String(postCount).padStart(2, "0")],
              ["域名", site.domain],
              ["定位", "AI 独立开发者"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="mono-xs">{label}</dt>
                <dd className="mono mt-2 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* ── 01 定位 ──────────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <SectionLabel index="01">定位</SectionLabel>

          <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="font-serif text-h3 leading-relaxed text-ink">
              不做「AI 专家」，也不做「老师」。先让真实项目和持续输出建立可信度。
            </p>
            <div className="space-y-5 text-[15px] leading-relaxed text-muted">
              <p>
                市面上大多数 AI 内容的问题在于：写的人自己没在做项目。
                于是内容停留在「这个工具很好用」的层面，遇到真实问题时帮不上忙。
              </p>
              <p>
                这里的做法反过来——所有内容都从项目里长出来。
                正在做的产品遇到什么问题，就写什么问题；做了哪些判断，就写哪些判断。
              </p>
              <p>
                这样内容的更新速度受限于项目进度，但每一条都是真的。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 写什么 ────────────────────────────────────────────────── */}
      <section className="section bg-paper-deep">
        <div className="shell">
          <SectionLabel index="02">写什么</SectionLabel>

          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {pillars.map((p) => (
              <article key={p.n} className="bg-surface p-7 md:p-8">
                <p className="mono-xs text-accent">{p.n}</p>
                <h3 className="mt-3 font-serif text-h3 text-ink">{p.title}</h3>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                  {p.body}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="mono-xs rounded-full border border-line px-2.5 py-1"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 内容管线 ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <SectionLabel index="03">一个项目，拆成整个内容矩阵</SectionLabel>

          <p className="max-w-[58ch] text-[15px] text-muted">
            不为每个平台重复生产内容。先完成一个核心项目，
            再围绕它拆分出不同平台适合的形式。
          </p>

          <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {pipeline.map((step, i) => (
              <li key={step.label} className="relative bg-surface p-6">
                <p className="mono-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-[15px] leading-snug font-medium text-ink">
                  {step.label}
                </p>
                <p className="mono-xs mt-2">{step.note}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 border-l-2 border-accent bg-surface px-6 py-5">
            <p className="mono-xs">示例 · AI 外贸数字员工</p>
            <p className="mt-2.5 max-w-[62ch] font-serif text-[1.125rem] leading-snug text-ink">
              网站写《我花 7 天用 Vibe Coding 做了一个 AI 外贸数字员工》，
              公众号写《AI Agent 真能替代一个外贸业务员吗？》，
              B站做 10–20 分钟完整复盘，GitHub 开源工具层。
            </p>
            <Link
              href="/writing/seven-days-ai-digital-employee"
              className="mono-xs mt-3 inline-flex items-center gap-1.5 py-2 text-accent"
            >
              读这篇 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 04 路线图 ────────────────────────────────────────────────── */}
      <section className="section bg-paper-deep">
        <div className="shell">
          <SectionLabel index="04">路线图</SectionLabel>

          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((r) => (
              <article key={r.version} className="bg-surface p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="mono text-accent">{r.version}</p>
                  <p className="mono-xs">{r.status}</p>
                </div>
                <h3 className="mt-3 font-serif text-h3 text-ink">{r.title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {r.items.map((item) => (
                    <li key={item.label} className="flex gap-3">
                      {item.done ? (
                        <span
                          aria-hidden
                          className="mono mt-[0.18em] w-3 shrink-0 text-[11px] text-ship"
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          aria-hidden
                          className="mt-[0.62em] h-px w-3 shrink-0 bg-line-strong"
                        />
                      )}
                      <span
                        className={`text-[14px] leading-snug ${
                          item.done ? "text-ink-2" : "text-muted"
                        }`}
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-[62ch] text-[15px] text-muted">
            刻意不做会员、支付和社区。等真正出现内容量、访问量和付费需求之后，
            再逐步升级。在此之前，先把品牌和内容体验做对。
          </p>
        </div>
      </section>

      {/* ── 05 原则 ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <SectionLabel index="05">做事原则</SectionLabel>

          <ol className="border-t border-line">
            {principles.map((p, i) => (
              <li
                key={p.title}
                className="grid gap-x-10 gap-y-2 border-b border-line py-6 md:grid-cols-[4rem_minmax(0,1fr)]"
              >
                <span className="mono-xs pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="grid gap-x-12 gap-y-2 md:grid-cols-[14rem_minmax(0,1fr)]">
                  <h3 className="text-[1.0625rem] leading-snug font-medium text-ink">
                    {p.title}
                  </h3>
                  <p className="max-w-[58ch] text-[15px] leading-relaxed text-muted">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 06 技术栈 + 联系 ─────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
            <div className="bg-surface p-8 md:p-10">
              <p className="eyebrow">这个网站是怎么做的</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "MDX",
                  "Vercel",
                ].map((t) => (
                  <li
                    key={t}
                    className="mono rounded-full border border-line px-3 py-1.5"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                文章用 MDX + Git 管理，写文章不需要打开后台。
                没有 CMS、没有用户系统、没有数据库——这些等真的需要时再加。
              </p>
            </div>

            <div className="bg-surface p-8 md:p-10">
              <p className="eyebrow">联系</p>
              <ul className="mt-6 space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      {...(s.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="group flex items-baseline justify-between gap-4 border-b border-line pb-3"
                    >
                      <span className="text-[15px] text-ink-2 transition-colors duration-200 group-hover:text-accent">
                        {s.label}
                      </span>
                      <span className="mono shrink-0">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
