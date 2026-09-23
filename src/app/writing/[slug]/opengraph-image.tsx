import { ogImage, OG_SIZE } from "@/lib/og-card";
import { getCategory } from "@/lib/site";
import { getAllPosts, getPost } from "@/lib/writing";

export const size = OG_SIZE;
export const contentType = "image/png";
// `generateImageMetadata` (per-page alt) is not supported by `output: "export"`.
export const alt = "SEVN AILAB — 文章卡片";
export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** `2026-09-14` -> `2026 · 09 · 14` */
function spacedDate(iso: string): string {
  return iso.split("-").join(" · ");
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return ogImage({ kicker: "NOT FOUND", title: "SEVN AILAB", meta: "BUILD WITH AI" });
  }

  return ogImage({
    kicker: (getCategory(post.category)?.label ?? "WRITING").toUpperCase(),
    title: post.title,
    subtitle: post.summary,
    meta: `${spacedDate(post.date)}   /   ${post.readingMinutes} MIN READ`,
  });
}
