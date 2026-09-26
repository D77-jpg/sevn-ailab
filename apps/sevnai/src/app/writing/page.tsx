import { Suspense } from "react";

import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@sevn/ui";
import { WritingIndex, WritingList } from "@/components/writing-index";
import { staticPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { categories } from "@/lib/site";
import { getAllPosts, getTagCounts, toSummary } from "@/lib/writing";

export const metadata = staticPageMetadata({
  title: "文章",
  description:
    "Vibe Coding、Agent 开发与 AI 产品的技术文章与项目复盘。每篇都包含具体的架构决策和踩坑记录。",
  path: "/writing",
});

export default function WritingPage() {
  const posts = getAllPosts().map(toSummary);
  const tags = getTagCounts();

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
            共 {posts.length} 篇 · {categories.length} 个分类 · {tags.length}{" "}
            个标签
          </p>
        }
      />

      {/* The fallback is the full, unfiltered list — that is what gets
          prerendered into writing.html. The client swaps in the filtered view
          as soon as it reads `?c=` / `?tag=`. */}
      <Suspense fallback={<WritingList posts={posts} tags={tags} />}>
        <WritingIndex posts={posts} tags={tags} />
      </Suspense>
    </>
  );
}
