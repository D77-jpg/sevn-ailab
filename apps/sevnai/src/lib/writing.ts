import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { CategorySlug } from "./site";

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

export type PostFrontmatter = {
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-09-14" */
  date: string;
  category: CategorySlug;
  tags?: string[];
  /** Surfaces the post on the homepage. */
  featured?: boolean;
  /** Hidden from every index while true. */
  draft?: boolean;
  /** Groups multi-part write-ups. */
  series?: string;
  /** Optional one-line takeaway shown on the article page. */
  takeaway?: string;
  /**
   * Slug of the SEVN GRADLAB topic this article can be narrowed into. When
   * set, the article ends with a quiet link to that topic page.
   */
  gradTopic?: string;
  /** Title of that topic, shown in the link. */
  gradTopicTitle?: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  readingMinutes: number;
  body: string;
};

/**
 * Chinese-aware reading time. Latin words are counted at ~200 wpm, CJK
 * characters at ~400 cpm — roughly matching how fast the two scripts are
 * actually read.
 *
 * Fence markers and backticks are stripped but the code itself is kept:
 * in technical writing people do read the code, and dropping it made the
 * estimate wildly optimistic on code-heavy posts.
 */
function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/^\s*(```|~~~).*$/gm, "")
    .replace(/`/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "");

  const cjk = (
    text.match(/[\u3400-\u4dbf\u4e00-\u9fff\u3040-\u30ff]/g) ?? []
  ).length;
  const latin = (text.match(/[A-Za-z0-9][A-Za-z0-9'’_-]*/g) ?? []).length;

  return Math.max(1, Math.round(cjk / 400 + latin / 200));
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(WRITING_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  return {
    ...fm,
    slug,
    tags: fm.tags ?? [],
    readingMinutes: readingMinutes(content),
    body: content,
  };
}

export function getAllPosts({ includeDrafts = false } = {}): Post[] {
  if (!fs.existsSync(WRITING_DIR)) return [];

  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getFeaturedPosts(limit = 3): Post[] {
  const all = getAllPosts();
  const featured = all.filter((p) => p.featured);
  return (featured.length >= limit ? featured : all).slice(0, limit);
}

/** Newer/older neighbours within the full chronological list. */
export function getAdjacentPosts(slug: string): {
  newer?: Post;
  older?: Post;
} {
  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { newer: all[i - 1], older: all[i + 1] };
}

export function getTagCounts(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export { formatDate, formatDateLong } from "./format";

/** The fields a list row needs — no body, so it is cheap to send to the client. */
export type PostSummary = Pick<
  Post,
  "slug" | "title" | "summary" | "date" | "category" | "tags" | "readingMinutes"
>;

export function toSummary(post: Post): PostSummary {
  const { slug, title, summary, date, category, tags, readingMinutes } = post;
  return { slug, title, summary, date, category, tags: tags ?? [], readingMinutes };
}

export function categoryOf(post: Post) {
  return post.category;
}
