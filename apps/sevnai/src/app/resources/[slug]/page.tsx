import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { Rating } from "@/components/rating";
import { SectionLabel } from "@sevn/ui";
import { pageAlternates } from "@/lib/metadata";
import { getAllResources, getAdjacentResources, getResource } from "@/lib/resources";
import { breadcrumbSchema, resourceSchema } from "@/lib/schema";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getResource(slug);
  if (!entry) return {};

  return {
    title: `${entry.name} — 资源记录`,
    description: entry.use,
    openGraph: {
      type: "article",
      url: `/resources/${entry.slug}`,
      title: `${entry.name} — 资源记录`,
      description: entry.use,
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.name} — 资源记录`,
      description: entry.use,
    },
    alternates: pageAlternates(`/resources/${entry.slug}`),
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry = getResource(slug);
  if (!entry) notFound();

  const { next } = getAdjacentResources(entry.slug);

  const spec: [string, string][] = [
    ["价格", entry.pricing],
    ["免费额度", entry.freeTier],
    ["适合谁", entry.audience],
    ["复核", entry.reviewed.replace("-", ".")],
  ];

  return (
    <article>
      <JsonLd data={resourceSchema(entry)} />
      <JsonLd
        data={breadcrumbSchema([
          ["首页", "/"],
          ["资源", "/resources"],
          [entry.name, `/resources/${entry.slug}`],
        ])}
      />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="section pb-0">
        <div className="shell">
          <Link
            href="/resources"
            className="mono group inline-flex items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5"
              style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            >
              ←
            </span>
            资源库
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="mono-xs text-accent">{entry.groupLabel}</span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <Rating value={entry.rating} />
          </div>

          <h1 className="mt-5 max-w-[22ch] font-serif text-h1 text-ink">
            {entry.name}
          </h1>

          <p className="mt-6 max-w-[58ch] text-lead text-muted">{entry.use}</p>

          {/* Datasheet — the same four questions every record answers */}
          <dl className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {spec.map(([label, value]) => (
              <div key={label} className="bg-surface px-5 py-4">
                <dt className="mono-xs">{label}</dt>
                <dd className="mono mt-2 text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          {/* One primary action only. Internal links live in section 02 —
              rendering the same two links here as well was duplication. */}
          <div className="mt-7">
            <a
              href={entry.href}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-primary"
            >
              打开官网 ↗
            </a>
          </div>
        </div>
      </header>

      {/* ── The caveat ───────────────────────────────────────────────────
          Placed first and given the most space on purpose. Anyone can list
          what a tool does; the reason to read this page instead of the
          vendor's is the part where it goes wrong. */}
      <section className="section">
        <div className="shell">
          <SectionLabel index="01">需要知道的问题</SectionLabel>
          <p className="max-w-[62ch] font-serif text-h3 leading-relaxed text-ink">
            {entry.caveat}
          </p>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            <div className="bg-paper p-7 md:p-9">
              <p className="eyebrow">适合谁</p>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
                {entry.audience}
              </p>
            </div>

            <div className="bg-paper p-7 md:p-9">
              <p className="eyebrow">价格</p>
              <dl className="mt-5 space-y-4">
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <dt className="mono-xs w-16 shrink-0 text-faint">计费</dt>
                  <dd className="text-[15px] leading-relaxed text-ink-2">
                    {entry.pricing}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <dt className="mono-xs w-16 shrink-0 text-faint">免费额度</dt>
                  <dd className="text-[15px] leading-relaxed text-ink-2">
                    {entry.freeTier}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <dt className="mono-xs w-16 shrink-0 text-faint">复核</dt>
                  <dd className="mono text-[14px] text-ink-2">
                    {entry.reviewed}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 max-w-[40ch] text-[13px] leading-relaxed text-faint">
                价格和额度会变。这条记录标注的是最近一次复核时间，
                如果你发现它已经过期，欢迎邮件告诉我。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related writing ──────────────────────────────────────────── */}
      {entry.related && entry.related.length > 0 && (
        <section className="section pt-0">
          <div className="shell">
            <SectionLabel index="02">相关</SectionLabel>
            <ul className="space-y-px border border-line">
              {entry.related.map((r) => (
                <li key={r.href} className="bg-surface">
                  <Link
                    href={r.href}
                    className="group flex items-center justify-between gap-6 px-6 py-5 transition-colors duration-200 hover:bg-paper-deep"
                  >
                    <span className="font-serif text-h3 text-ink">{r.label}</span>
                    <span
                      aria-hidden
                      className="mono text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                      style={{
                        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
                      }}
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Next in group ────────────────────────────────────────────── */}
      {next && next.slug !== entry.slug && (
        <section className="section pt-0">
          <div className="shell">
            <Link
              href={`/resources/${next.slug}`}
              className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border border-line bg-surface px-6 py-7 transition-colors duration-200 hover:border-line-strong md:px-8"
            >
              <span>
                <span className="mono-xs block text-faint">
                  {entry.groupLabel} 中的下一个
                </span>
                <span className="mt-2.5 block font-serif text-h3 text-ink">
                  {next.name}
                </span>
                <span className="mt-2 block max-w-[52ch] text-[14px] leading-relaxed text-muted">
                  {next.use}
                </span>
              </span>
              <span
                aria-hidden
                className="mono text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
              >
                →
              </span>
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
