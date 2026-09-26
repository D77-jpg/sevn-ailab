import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { crossLink } from "@sevn/ui";

import { JsonLd } from "@/components/json-ld";
import { TocInline, TocSidebar } from "@/components/toc";
import { renderMarkdown } from "@/lib/mdx";
import { pageAlternates } from "@/lib/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { getCategory, gradlab } from "@/lib/site";
import { extractHeadings } from "@/lib/toc";
import {
  formatDate,
  formatDateLong,
  getAllPosts,
  getAdjacentPosts,
  getPost,
} from "@/lib/writing";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      url: `/writing/${post.slug}`,
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      tags: post.tags,
    },
    // Next.js does not deep-merge `twitter` with the root layout's, so without
    // this the shared card would advertise the site tagline instead of the post.
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
    alternates: pageAlternates(`/writing/${post.slug}`),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const [content] = await Promise.all([renderMarkdown(post.body)]);
  const headings = extractHeadings(post.body);
  const category = getCategory(post.category);
  const { newer, older } = getAdjacentPosts(post.slug);

  return (
    <article>
      <JsonLd data={articleSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          ["首页", "/"],
          ["文章", "/writing"],
          [post.title, `/writing/${post.slug}`],
        ])}
      />

      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <header className="section pb-0">
        <div className="shell">
          <Link
            href="/writing"
            className="mono group inline-flex items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5"
              style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            >
              ←
            </span>
            文章
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href={`/writing?c=${post.category}`}
              className="mono-xs inline-flex items-center py-2 text-accent transition-opacity duration-200 hover:opacity-70"
            >
              {category?.label ?? post.category}
            </Link>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <time dateTime={post.date} className="mono-xs">
              {formatDate(post.date)}
            </time>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <span className="mono-xs">{post.readingMinutes} 分钟阅读</span>
          </div>

          <h1 className="mt-6 max-w-[26ch] font-serif text-h1 text-ink">
            {post.title}
          </h1>

          <p className="mt-6 max-w-[62ch] text-lead text-muted">
            {post.summary}
          </p>

          {post.takeaway && (
            <div className="mt-9 max-w-[62ch] border-l-2 border-accent bg-surface px-6 py-5">
              <p className="mono-xs">一句话结论</p>
              <p className="mt-2.5 font-serif text-[1.125rem] leading-snug text-ink">
                {post.takeaway}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* ── Body + TOC ───────────────────────────────────────────────── */}
      <div className="section pt-12">
        <div className="shell">
          {/* The explicit minmax(0,1fr) track is load-bearing: without it the
              grid track is sized by the code blocks' intrinsic width, which
              blows the article out to ~660px on a 390px phone. */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-x-14 lg:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="min-w-0 max-w-[68ch]">
              {headings.length > 2 && <TocInline headings={headings} />}
              <div className="prose">{content}</div>

              {post.gradTopic && post.gradTopicTitle && (
                <a
                  href={crossLink(`${gradlab.url}/topics/${post.gradTopic}/`, {
                    from: "sevnai",
                    medium: "article_cta",
                    content: post.slug,
                  })}
                  className="group mt-14 block border-t border-line pt-6"
                >
                  <p className="mono-xs">收窄成一个毕设题</p>
                  <p className="mt-2.5 text-[1.0625rem] leading-snug font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                    {post.gradTopicTitle} ↗
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                    这篇的架构可以改编成一个本科 8–12 周做得完的题目。范围、创新点和验证方案写在 {gradlab.name}。
                  </p>
                </a>
              )}
            </div>

            {headings.length > 2 && (
              <aside className="hidden lg:block">
                <TocSidebar headings={headings} />
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* ── Tags + navigation ────────────────────────────────────────── */}
      <div className="section pt-0">
        <div className="shell">
          {post.tags && post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/writing?tag=${encodeURIComponent(tag)}`}
                    className="mono inline-flex min-h-9 items-center rounded-full border border-line px-3 py-1.5 transition-colors duration-200 hover:border-line-strong hover:text-ink"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {newer ? (
              <AdjacentLink post={newer} direction="newer" />
            ) : (
              <div className="bg-paper p-6">
                <p className="mono-xs">更新的一篇</p>
                <p className="mt-3 text-[15px] text-faint">已经是第一篇了</p>
              </div>
            )}
            {older ? (
              <AdjacentLink post={older} direction="older" />
            ) : (
              <div className="bg-paper p-6">
                <p className="mono-xs">更早的一篇</p>
                <p className="mt-3 text-[15px] text-faint">已经是最后一篇了</p>
              </div>
            )}
          </div>

          <p className="mono mt-8 text-center">
            写于 {formatDateLong(post.date)}
          </p>
        </div>
      </div>
    </article>
  );
}

function AdjacentLink({
  post,
  direction,
}: {
  post: { slug: string; title: string; summary: string };
  direction: "newer" | "older";
}) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className={`group bg-paper p-6 transition-colors duration-200 hover:bg-surface ${
        direction === "older" ? "md:text-right" : ""
      }`}
    >
      <p className="mono-xs">
        {direction === "newer" ? "更新的一篇" : "更早的一篇"}
      </p>
      <p className="mt-3 text-[1.0625rem] leading-snug font-medium text-ink transition-colors duration-200 group-hover:text-accent">
        {post.title}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-muted line-clamp-2">
        {post.summary}
      </p>
    </Link>
  );
}
