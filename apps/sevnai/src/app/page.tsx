import Link from "next/link";

import { PostRow, PostRowLegend } from "@/components/post-row";
import { ProjectRow } from "@/components/project-row";
import { SectionHeader } from "@sevn/ui";
import { projects } from "@/lib/projects";
import { resources, resourceGroups } from "@/lib/resources";
import { externalProps, isLive, site, socials } from "@/lib/site";
import { formatDate, getAllPosts } from "@/lib/writing";

export default function HomePage() {
  const allPosts = getAllPosts();
  const latest = allPosts.slice(0, 4);
  const active = projects.filter((p) => p.status !== "shipped");
  const shipped = projects.filter((p) => p.status === "shipped");
  const resourceCount = Object.values(resources).reduce(
    (n, list) => n + list.length,
    0,
  );

  // "What's happening right now" — newest log entry across every project.
  const latestLog = projects
    .flatMap((p) => p.log.map((entry) => ({ ...entry, project: p })))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  const strip = [
    { label: "进行中项目", value: String(active.length).padStart(2, "0") },
    { label: "已发布文章", value: String(allPosts.length).padStart(2, "0") },
    { label: "资源条目", value: String(resourceCount).padStart(2, "0") },
    { label: "最近更新", value: formatDate(allPosts[0]?.date ?? "2026-09-01") },
  ];

  return (
    <>
      {/* ── Hero — centered, Apple-keynote scale ─────────────────────── */}
      <section className="relative isolate overflow-hidden">
        {/* Full-bleed backdrop: the workbench photo, only lightly softened —
            a 1.5px blur plus a veil that is strong enough at the top for the
            headline and thin enough in the middle that the photo still reads.
            It dissolves into the paper before the article card, so there is
            never a hard edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden md:h-[700px]"
        >
          {/* Pre-encoded AVIF/WebP (scripts/optimize-images.mjs): a static
              export has no image optimizer, and the raw JPEG was 185 KB. */}
          <picture>
            <source
              type="image/avif"
              srcSet="/hero-desk-828.avif 828w, /hero-desk-1672.avif 1672w"
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet="/hero-desk-828.webp 828w, /hero-desk-1672.webp 1672w"
              sizes="100vw"
            />
            <img
              src="/hero-desk.jpg"
              alt=""
              width={1672}
              height={941}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full scale-[1.02] object-cover object-[42%_center] blur-[1.5px] md:object-center"
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{
              // Tuned band by band against where the type actually sits: the
              // big headline can carry the thinnest veil (so the photo reads
              // at its strongest there), while the small eyebrow and the lead
              // paragraph get more paper behind them.
              background:
                "linear-gradient(to bottom, color-mix(in srgb, var(--paper) 90%, transparent) 0%, color-mix(in srgb, var(--paper) 80%, transparent) 20%, color-mix(in srgb, var(--paper) 48%, transparent) 40%, color-mix(in srgb, var(--paper) 62%, transparent) 58%, color-mix(in srgb, var(--paper) 78%, transparent) 74%, color-mix(in srgb, var(--paper) 92%, transparent) 88%, var(--paper) 100%)",
            }}
          />
        </div>

        <div className="shell flex flex-col items-center pt-16 text-center md:pt-24">
          <p className="rise mono-xs" style={{ animationDelay: "0ms" }}>
            SEVN AILAB — 一个公开的 AI 实验室
          </p>

          <h1
            className="rise mt-7 font-sans font-bold text-ink"
            style={{
              animationDelay: "70ms",
              fontSize: "clamp(56px, 7vw, 96px)",
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
            }}
          >
            Build with <em className="em-serif">AI.</em>
          </h1>

          <p
            className="rise mt-6 font-semibold text-ink-2"
            style={{
              animationDelay: "140ms",
              fontSize: "clamp(28px, 3.4vw, 42px)",
              lineHeight: 1.12,
              letterSpacing: "-0.032em",
            }}
          >
            把想法做成真正能跑起来的产品。
          </p>

          <p
            className="rise mt-7 max-w-[680px] text-[17px] leading-[1.75] tracking-[-0.005em] text-ink-2"
            style={{ animationDelay: "210ms" }}
          >
            {site.name} 是一个公开的 AI 实验室。这里记录 Vibe Coding、Agent
            开发与 AI 产品实战的全过程——包括架构决策、返工和踩坑，而不只是成功的部分。
          </p>

          <div
            className="rise mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <Link href="/writing" className="btn btn-primary">
              阅读最新文章
              <span aria-hidden>→</span>
            </Link>
            <Link href="/projects" className="btn btn-secondary">
              查看项目实验室
            </Link>
          </div>

          <div className="rise mt-8" style={{ animationDelay: "340ms" }}>
            <span className="status" data-state="building">
              公开构建中
            </span>
          </div>
        </div>

        {/* Fact strip — four calm columns, big numerals, hairline rules.
            Two columns on mobile. */}
        <div className="shell">
          <dl className="mt-20 grid grid-cols-[repeat(2,minmax(0,1fr))] border-y border-line md:mt-28 md:grid-cols-[repeat(4,minmax(0,1fr))]">
            {strip.map((cell, i) => (
              <div
                key={cell.label}
                className={[
                  "flex min-w-0 flex-col px-5 py-8 md:px-7 md:py-10",
                  i % 2 === 1 ? "border-l border-line" : "",
                  i > 0 ? "md:border-l md:border-line" : "",
                  i >= 2 ? "border-t border-line md:border-t-0" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <dt className="mono-xs order-2 mt-2.5">{cell.label}</dt>
                <dd className="order-1 text-[clamp(1.35rem,6vw,2.25rem)] leading-none font-semibold tracking-[-0.035em] whitespace-nowrap text-ink tabular-nums">
                  {cell.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 01 Lab ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <SectionHeader
            index="01"
            label="实验室"
            title="正在做的东西"
            description="不是作品集，是工作台。状态、技术栈和进度都摆在明面上。"
            action={{ label: "全部项目", href: "/projects" }}
          />

          <div className="border-t border-line">
            {projects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>

          <p className="mono-xs mt-5">
            {active.length} 个进行中 · {shipped.length} 个已上线
          </p>
        </div>
      </section>

      {/* ── 02 Writing ───────────────────────────────────────────────── */}
      <section className="section bg-paper-deep">
        <div className="shell">
          <SectionHeader
            index="02"
            label="文章"
            title="最近在写"
            description="一个项目拆成不同平台的内容。这里放最完整的那一版。"
            action={{ label: "全部文章", href: "/writing" }}
          />

          <PostRowLegend />
          <div className="border-t border-line md:border-t-0">
            {latest.map((post, i) => (
              <PostRow key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 Build Log ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <SectionHeader
            index="03"
            label="构建日志"
            title="最近发生了什么"
            description="开发中真实的判断和返工。写下来是因为下次还会遇到。"
          />

          <ol className="grid gap-x-10 gap-y-9 md:grid-cols-3">
            {latestLog.map((entry) => (
              <li key={`${entry.project.slug}-${entry.title}`}>
                <div className="flex items-center gap-3">
                  <span className="mono text-ink">{entry.date}</span>
                  <span aria-hidden className="h-px flex-1 bg-line" />
                </div>
                <h3 className="mt-4 text-[1.0625rem] leading-snug font-medium text-ink">
                  {entry.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
                  {entry.body}
                </p>
                <Link
                  href={`/projects/${entry.project.slug}`}
                  className="mono-xs mt-3 inline-flex items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
                >
                  {entry.project.name}
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 04 Resources ─────────────────────────────────────────────── */}
      <section className="section bg-paper-deep">
        <div className="shell">
          <SectionHeader
            index="04"
            label="资源"
            title="我实际在用的东西"
            description="每一条都按同一套字段记录：价格、免费额度、适合谁，以及它的缺点。"
            action={{ label: "打开资源库", href: "/resources" }}
          />

          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {resourceGroups.map((g) => {
              const group = resources[g.slug];
              return (
                <Link
                  key={g.slug}
                  href={`/resources#${g.slug}`}
                  className="group bg-surface p-7 transition-colors duration-200 hover:bg-paper"
                >
                  <p className="mono-xs">
                    {String(group.length).padStart(2, "0")} 条
                  </p>
                  <h3 className="mt-3 font-serif text-h3 text-ink transition-colors duration-200 group-hover:text-accent">
                    {g.label}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
                    {g.blurb}
                  </p>
                  <ul className="mt-5 space-y-1.5">
                    {group.slice(0, 3).map((r) => (
                      <li key={r.name} className="mono truncate">
                        {r.name}
                      </li>
                    ))}
                  </ul>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 05 Channels ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <SectionHeader
            index="05"
            label="渠道"
            title="社媒负责把人带过来，网站负责留住"
            description="每个渠道发的东西不一样。点进去之前先知道会看到什么。"
          />

          <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {socials.map((s) => {
              const body = (
                <>
                  <div>
                    <h3
                      className={`flex items-baseline justify-between gap-3 text-[1.0625rem] font-medium transition-colors duration-200 ${
                        isLive(s) ? "text-ink group-hover:text-accent" : "text-ink-2"
                      }`}
                    >
                      {s.label}
                      {isLive(s) ? (
                        <span
                          aria-hidden
                          className="text-[13px] text-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                        >
                          {s.href.startsWith("http") ? "↗" : "→"}
                        </span>
                      ) : (
                        <span className="mono-xs">即将开通</span>
                      )}
                    </h3>
                    <p className="mt-2 text-[14px] text-muted">{s.note}</p>
                  </div>
                  <span className="mono truncate">{s.handle}</span>
                </>
              );
              const cls =
                "group flex h-full flex-col justify-between gap-6 p-6";
              return (
                <li key={s.label} className="bg-paper">
                  {isLive(s) ? (
                    <a
                      href={s.href}
                      {...externalProps(s.href)}
                      className={`${cls} transition-colors duration-200 hover:bg-surface`}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Closing statement ────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <div
            className="rounded-lg border border-line px-7 py-12 md:px-14 md:py-16"
            style={{ background: "var(--ink)", color: "var(--paper)" }}
          >
            <p
              className="mono-xs"
              style={{
                color: "color-mix(in oklab, var(--paper) 64%, transparent)",
              }}
            >
              核心策略
            </p>
            <p
              className="mt-5 max-w-[32ch] font-serif text-h2"
              style={{ color: "var(--paper)" }}
            >
              用 90 天，把「正在用 AI 做产品」变成一个可持续的个人技术品牌。
            </p>
            <p
              className="mt-6 max-w-[58ch] text-[15px] leading-relaxed"
              style={{
                color: "color-mix(in oklab, var(--paper) 68%, transparent)",
              }}
            >
              网站是内容中枢，社媒是流量入口，GitHub 是技术影响力。
              数字产品与教学是商业化——但在那之前，先把真实项目做出来。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="btn"
                style={{ background: "var(--paper)", color: "var(--ink)" }}
              >
                关于这个实验室
              </Link>
              <Link
                href="/rss.xml"
                className="btn"
                style={{
                  color: "var(--paper)",
                  borderColor:
                    "color-mix(in oklab, var(--paper) 30%, transparent)",
                }}
              >
                订阅 RSS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

