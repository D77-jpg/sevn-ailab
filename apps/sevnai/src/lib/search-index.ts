import { getAllPosts } from "./writing";
import { projects, statusMeta } from "./projects";
import { resourceGroups, resources } from "./resources";
import { getCategory } from "./site";
import type { SearchDoc } from "./search";

/**
 * Server-only: builds the search index from the content layer.
 *
 * Kept apart from `search.ts` so the client component can import the matching
 * logic without dragging `node:fs` into the browser bundle.
 */

/**
 * Flatten MDX/Markdown to plain text for indexing.
 *
 * Code fences are dropped entirely rather than kept: they bloat the index and
 * matching against identifier soup produces noisy hits. The prose around them
 * is what people actually search for.
 */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/^\s{0,3}\d+\.\s+/gm, "")
    .replace(/^\s*\|.*\|\s*$/gm, " ")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const post of getAllPosts()) {
    docs.push({
      kind: "writing",
      href: `/writing/${post.slug}`,
      title: post.title,
      summary: post.summary,
      meta: getCategory(post.category)?.label ?? post.category,
      tags: post.tags ?? [],
      body: toPlainText(post.body),
    });
  }

  for (const project of projects) {
    docs.push({
      kind: "project",
      href: `/projects/${project.slug}`,
      title: project.name,
      summary: project.summary,
      meta: statusMeta[project.status].label,
      tags: project.stack,
      body: [
        project.why,
        ...project.works,
        ...project.open,
        ...project.log.flatMap((l) => [l.title, l.body]),
      ].join(" "),
    });
  }

  for (const group of resourceGroups) {
    for (const item of resources[group.slug]) {
      docs.push({
        kind: "resource",
        // The record's own page, not the group anchor — a search result that
        // drops you into the middle of a 14-item list is not a result.
        href: `/resources/${item.slug}`,
        title: item.name,
        summary: item.use,
        meta: group.label,
        tags: [item.audience],
        body: [item.pricing, item.freeTier, item.audience, item.caveat].join(" "),
      });
    }
  }

  return docs;
}
