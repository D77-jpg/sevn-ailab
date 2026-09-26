import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { SectionLabel, StatusPill } from "@sevn/ui";
import { pageAlternates } from "@/lib/metadata";
import { getProject, projects } from "@/lib/projects";
import { breadcrumbSchema, projectSchema } from "@/lib/schema";
import { formatDate } from "@/lib/format";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.summary,
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: project.name,
      description: project.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.summary,
    },
    alternates: pageAlternates(`/projects/${project.slug}`),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const spec: [string, string][] = [
    ["状态", project.statusLabel],
    ["技术栈", project.stack.join(" · ")],
    ["开始", formatDate(project.started)],
    ["最近更新", formatDate(project.updated)],
  ];

  return (
    <article>
      <JsonLd data={projectSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          ["首页", "/"],
          ["项目", "/projects"],
          [project.name, `/projects/${project.slug}`],
        ])}
      />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="section pb-0">
        <div className="shell">
          <Link
            href="/projects"
            className="mono group inline-flex items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5"
              style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            >
              ←
            </span>
            项目
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="mono-xs text-accent">{project.index}</span>
            <StatusPill state={project.status} label={project.statusLabel} />
          </div>

          <h1 className="mt-5 max-w-[20ch] font-serif text-h1 text-ink">
            {project.name}
          </h1>

          <p className="mt-6 max-w-[58ch] text-lead text-muted">
            {project.summary}
          </p>

          {/* Datasheet */}
          <dl className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {spec.map(([label, value]) => (
              <div key={label} className="bg-surface px-5 py-4">
                <dt className="mono-xs">{label}</dt>
                <dd className="mono mt-2 text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          {project.links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.links.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className={`btn ${i === 0 ? "btn-primary" : "btn-secondary"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Why ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="shell">
          <SectionLabel index="01">为什么做</SectionLabel>
          <p className="max-w-[62ch] font-serif text-h3 leading-relaxed text-ink">
            {project.why}
          </p>
        </div>
      </section>

      {/* ── Works / Open ─────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            <div className="bg-paper p-7 md:p-9">
              <h3 className="eyebrow">目前能跑通</h3>
              <ul className="mt-6 space-y-4">
                {project.works.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="mt-[0.62em] h-px w-3 shrink-0"
                      style={{ background: "var(--st-ship)" }}
                    />
                    <span className="text-[15px] leading-relaxed text-ink-2">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-paper p-7 md:p-9">
              <h3 className="eyebrow">还没解决</h3>
              <ul className="mt-6 space-y-4">
                {project.open.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="mt-[0.62em] h-px w-3 shrink-0"
                      style={{ background: "var(--st-build)" }}
                    />
                    <span className="text-[15px] leading-relaxed text-ink-2">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Log ──────────────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <SectionLabel index="02">开发日志</SectionLabel>

          <ol className="border-t border-line">
            {project.log.map((entry) => (
              <li
                key={`${entry.date}-${entry.title}`}
                className="grid gap-x-10 gap-y-3 border-b border-line py-7 md:grid-cols-[8rem_minmax(0,1fr)]"
              >
                <span className="mono pt-1">{entry.date}</span>
                <div className="max-w-[62ch]">
                  <h3 className="text-[1.0625rem] leading-snug font-medium text-ink">
                    {entry.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {entry.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Next project ─────────────────────────────────────────────── */}
      <section className="section pt-0">
        <div className="shell">
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8"
          >
            <div>
              <p className="mono-xs">下一个项目</p>
              <p className="mt-3 font-serif text-h3 text-ink transition-colors duration-200 group-hover:text-accent">
                {next.name}
              </p>
            </div>
            <span
              aria-hidden
              className="mono text-muted transition-transform duration-300 group-hover:translate-x-1"
              style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
