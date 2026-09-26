"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { PostRow, PostRowLegend } from "@/components/post-row";
import { Empty, SectionLabel } from "@sevn/ui";
import { categories, getCategory } from "@/lib/site";
import type { PostSummary } from "@/lib/writing";

type Filter = { category?: string; tag?: string };

/**
 * The /writing list with category and tag filters.
 *
 * Filtering runs in the browser so the page can be a single static file
 * (Cloudflare has no server to read `?c=`). Every filter state is still a
 * real, shareable URL — `/writing?c=agent`, `/writing?tag=MCP` — and the
 * unfiltered list is what gets prerendered, so crawlers and no-JS readers see
 * every post.
 */
export function WritingIndex({
  posts,
  tags,
}: {
  posts: PostSummary[];
  tags: { tag: string; count: number }[];
}) {
  const params = useSearchParams();
  const c = params.get("c") ?? undefined;
  const t = params.get("tag") ?? undefined;

  return (
    <WritingList
      posts={posts}
      tags={tags}
      filter={{
        category: c && getCategory(c) ? c : undefined,
        tag: t && tags.some((x) => x.tag === t) ? t : undefined,
      }}
    />
  );
}

/** Pure render of a given filter state. Also used as the prerendered fallback. */
export function WritingList({
  posts,
  tags,
  filter = {},
}: {
  posts: PostSummary[];
  tags: { tag: string; count: number }[];
  filter?: Filter;
}) {
  const { category, tag } = filter;
  const activeCategory = category ? getCategory(category) : undefined;

  const visible = posts.filter(
    (p) =>
      (!category || p.category === category) &&
      (!tag || (p.tags ?? []).includes(tag)),
  );

  const filtered = Boolean(category || tag);
  const heading = tag
    ? `标签「${tag}」下的文章`
    : activeCategory
      ? `${activeCategory.label} 分类下的文章`
      : "全部文章";

  return (
    <>
      <section className="section pt-0">
        <div className="shell">
          {/* Category filter — plain links, so every state is a real URL */}
          <nav
            aria-label="文章分类"
            className="flex flex-wrap items-center gap-x-2 gap-y-2 border-y border-line py-4"
          >
            <FilterChip href="/writing" active={!filtered}>
              全部
              <Count n={posts.length} />
            </FilterChip>

            {categories.map((cat) => (
              <FilterChip
                key={cat.slug}
                href={`/writing?c=${cat.slug}`}
                active={category === cat.slug && !tag}
              >
                {cat.label}
                <Count
                  n={posts.filter((p) => p.category === cat.slug).length}
                />
              </FilterChip>
            ))}

            <p className="mono ml-auto hidden pl-4 sm:block" aria-live="polite">
              {visible.length} 篇
            </p>
          </nav>

          {(activeCategory || tag) && (
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
              <p className="max-w-[62ch] text-[15px] text-muted">
                {tag ? (
                  <>
                    正在查看标签{" "}
                    <span className="mono text-ink">{tag}</span>{" "}
                    下的 {visible.length} 篇文章。
                  </>
                ) : (
                  activeCategory?.description
                )}
              </p>
              <Link
                href="/writing"
                className="mono inline-flex items-center gap-1.5 py-2 text-muted transition-colors duration-200 hover:text-accent"
              >
                清除筛选
                <span aria-hidden>×</span>
              </Link>
            </div>
          )}

          {/* The list has no visible label, but it still needs an <h2> so the
              outline doesn't jump from the page <h1> straight to the row
              <h3>s — that gap breaks screen-reader heading navigation. */}
          <h2 className="sr-only">{heading}</h2>

          {visible.length === 0 ? (
            <div className="mt-10">
              <Empty hint="换个分类看看，或者直接订阅 RSS">
                这里还没有文章。
              </Empty>
            </div>
          ) : (
            <>
              <div className="mt-10">
                <PostRowLegend />
              </div>
              <div className="border-t border-line md:border-t-0">
                {visible.map((post, i) => (
                  <PostRow key={post.slug} post={post} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {tags.length > 0 && (
        <section className="section pt-0">
          <div className="shell">
            <SectionLabel>按标签浏览</SectionLabel>
            <ul className="flex flex-wrap gap-2">
              {tags.map((x) => {
                const active = x.tag === tag;
                return (
                  <li key={x.tag}>
                    <Link
                      href={
                        active
                          ? "/writing"
                          : `/writing?tag=${encodeURIComponent(x.tag)}`
                      }
                      aria-current={active ? "true" : undefined}
                      className={`mono inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 transition-colors duration-200 ${
                        active
                          ? "border-transparent bg-ink text-paper"
                          : "border-line hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      {x.tag}
                      <span className={active ? "opacity-60" : "text-faint"}>
                        {x.count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function Count({ n }: { n: number }) {
  return <span className="ml-1.5 opacity-70">{String(n).padStart(2, "0")}</span>;
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`mono inline-flex min-h-9 items-center rounded-full border px-3.5 py-2 transition-colors duration-200 ${
        active
          ? "border-transparent bg-ink text-paper"
          : "border-line text-muted hover:border-line-strong hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
