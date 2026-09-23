import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { PostRow, PostRowLegend } from "@/components/post-row";
import { Empty, PageHero, SectionLabel } from "@/components/ui";
import { staticPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { categories, getCategory } from "@/lib/site";
import { getAllPosts, getTagCounts } from "@/lib/writing";

export const metadata = staticPageMetadata({
  title: "文章",
  description:
    "Vibe Coding、Agent 开发与 AI 产品的技术文章与项目复盘。每篇都包含具体的架构决策和踩坑记录。",
  path: "/writing",
});

type Search = { c?: string };

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { c } = await searchParams;
  const active = c && getCategory(c) ? c : undefined;

  const posts = active
    ? getAllPosts().filter((p) => p.category === active)
    : getAllPosts();

  const tags = getTagCounts().slice(0, 12);
  const activeCategory = active ? getCategory(active) : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          ["首页", "/"],
          ["文章", "/writing"],
        ])}
      />
      <PageHero
        eyebrow="文章"
        title={
          <>
            技术文章与
            <br />
            项目复盘
          </>
        }
        lead="每篇都从一个真实问题开始。写架构决策、写返工、写最后没解决的部分——因为那部分通常更有用。"
        meta={
          <p className="mono">
            共 {posts.length} 篇 ·{" "}
            {active ? activeCategory?.label : "全部分类"}
          </p>
        }
      />

      <section className="section pt-0">
        <div className="shell">
          {/* Category filter — plain links, so every state is a real URL */}
          <nav
            aria-label="文章分类"
            className="flex flex-wrap items-center gap-x-2 gap-y-2 border-y border-line py-4"
          >
            <FilterChip href="/writing" active={!active}>
              全部
              <span className="ml-1.5">
                {String(getAllPosts().length).padStart(2, "0")}
              </span>
            </FilterChip>

            {categories.map((cat) => {
              const count = getAllPosts().filter(
                (p) => p.category === cat.slug,
              ).length;
              return (
                <FilterChip
                  key={cat.slug}
                  href={`/writing?c=${cat.slug}`}
                  active={active === cat.slug}
                >
                  {cat.label}
                  <span className="ml-1.5">
                    {String(count).padStart(2, "0")}
                  </span>
                </FilterChip>
              );
            })}
          </nav>

          {activeCategory && (
            <p className="mt-6 max-w-[62ch] text-[15px] text-muted">
              {activeCategory.description}
            </p>
          )}

          {/* The list has no visible label, but it still needs an <h2> so the
              outline doesn't jump from the page <h1> straight to the card
              <h3>s — that gap breaks screen-reader heading navigation. */}
          <h2 className="sr-only">
            {activeCategory ? `${activeCategory.label} 分类下的文章` : "全部文章"}
          </h2>

          {posts.length === 0 ? (
            <div className="mt-10">
              <Empty hint="换个分类看看，或者直接订阅 RSS">
                这个分类下还没有文章。
              </Empty>
            </div>
          ) : (
            <>
              <div className="mt-10">
                <PostRowLegend />
              </div>
              <div className="border-t border-line md:border-t-0">
                {posts.map((post, i) => (
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
            <SectionLabel>标签</SectionLabel>
            <ul className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <li key={t.tag}>
                  <span className="mono inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
                    {t.tag}
                    <span className="text-faint">{t.count}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
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
      aria-current={active ? "true" : undefined}
      className={`mono inline-flex items-center rounded-full border px-3.5 py-2 transition-colors duration-200 ${
        active
          ? "border-transparent bg-ink text-paper"
          : "border-line text-muted hover:border-line-strong hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
