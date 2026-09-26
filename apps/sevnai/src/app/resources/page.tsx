import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Rating } from "@/components/rating";
import { PageHero, SectionLabel } from "@sevn/ui";
import { staticPageMetadata } from "@/lib/metadata";
import { resourceGroups, resources } from "@/lib/resources";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = staticPageMetadata({
  title: "资源",
  description:
    "AI 工具、模型与 Agent 开发资源库。每条都按同一套字段记录：用途、价格、免费额度、适合谁、以及缺点。",
  path: "/resources",
});

export default function ResourcesPage() {
  const total = Object.values(resources).reduce((n, l) => n + l.length, 0);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          ["首页", "/"],
          ["资源", "/resources"],
        ])}
      />
      <PageHero
        eyebrow="资源库"
        title={
          <>
            我实际在用的
            <br />
            工具与模型
          </>
        }
        lead="不是链接收藏夹。每一条都回答了同样几个问题：干什么用、多少钱、适合谁、以及它的问题在哪。"
        meta={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="mono">{total} 条记录</span>
            <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />
            <nav aria-label="资源分组" className="flex flex-wrap gap-2">
              {resourceGroups.map((g) => (
                <a
                  key={g.slug}
                  href={`#${g.slug}`}
                  className="mono rounded-full border border-line px-3.5 py-1.5 text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
                >
                  {g.label}
                </a>
              ))}
            </nav>
          </div>
        }
      />

      {resourceGroups.map((group, gi) => {
        const items = resources[group.slug];

        return (
          <section
            key={group.slug}
            id={group.slug}
            className={`section ${gi === 0 ? "pt-0" : ""}`}
          >
            <div className="shell">
              <SectionLabel index={String(gi + 1).padStart(2, "0")}>
                {group.label}
              </SectionLabel>

              <p className="max-w-[58ch] text-[15px] text-muted">
                {group.blurb}
              </p>

              <div className="mt-10 space-y-px">
                {items.map((item) => (
                  <ResourceCard key={item.slug} item={item} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section pt-0">
        <div className="shell">
          <div className="border border-dashed border-line-strong px-6 py-12 text-center">
            <p className="mono-xs">持续更新</p>
            <p className="mx-auto mt-4 max-w-[44ch] font-serif text-h3 text-ink">
              价格和额度会变，评分也会变。
            </p>
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px] text-muted">
              每条记录都标注了最近复核时间。如果发现哪条过期了，
              欢迎通过邮件告诉我。
            </p>
            <a
              href="mailto:hi@sevnai.site"
              className="btn btn-secondary mt-8"
            >
              反馈一条错误
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ResourceCard({
  item,
}: {
  item: (typeof resources)[keyof typeof resources][number];
}) {
  const specs: [string, string][] = [
    ["价格", item.pricing],
    ["免费额度", item.freeTier],
    ["适合谁", item.audience],
  ];

  return (
    <article className="border border-line bg-surface">
      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Identity */}
        <div className="bg-surface p-6 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <h3 className="font-serif text-h3 text-ink">
              <Link
                href={`/resources/${item.slug}`}
                /* `-my-2 py-2` grows the hit area to ~40px without moving
                   anything: the margin box is unchanged, so baseline alignment
                   with the rating beside it holds. A 24px-tall target passes
                   WCAG 2.5.8 but is unpleasant on a phone. */
                className="group -my-2 inline-flex items-baseline gap-2 py-2 transition-colors duration-200 hover:text-accent"
              >
                {item.name}
                <span
                  aria-hidden
                  className="inline-block text-[0.5em] text-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                  style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
                >
                  →
                </span>
              </Link>
            </h3>
            <Rating value={item.rating} />
          </div>

          <p className="mt-3.5 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
            {item.use}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-xs inline-flex items-center py-2 text-accent transition-opacity duration-200 hover:opacity-70"
            >
              官网 ↗
            </a>
            {item.related?.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="mono-xs inline-flex items-center py-2 text-muted transition-colors duration-200 hover:text-accent"
              >
                {r.label} →
              </Link>
            ))}
          </div>
        </div>

        {/* Specs */}
        <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-1">
          {specs.map(([label, value]) => (
            <div
              key={label}
              className="bg-surface px-6 py-4 sm:px-7 lg:py-3.5"
            >
              <dt className="mono-xs">{label}</dt>
              <dd className="mt-1.5 text-[14px] leading-snug text-ink-2">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The honest caveat — visually separated because it's the useful part */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line bg-paper-deep px-6 py-4 md:px-7">
        <p className="flex max-w-[70ch] gap-3.5">
          <span className="mono-xs shrink-0 pt-[0.15em] text-faint">注意</span>
          <span className="text-[14px] leading-relaxed text-muted">
            {item.caveat}
          </span>
        </p>
        {/* The list page promises a review date on every record; this is it. */}
        <span className="mono-xs shrink-0 text-faint">
          复核 {item.reviewed.replace("-", ".")}
        </span>
      </div>
    </article>
  );
}
