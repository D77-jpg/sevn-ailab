import type { MetadataRoute } from "next";

export const dynamic = "force-static";

import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/writing";
import { projects } from "@/lib/projects";
import { getAllResources } from "@/lib/resources";

/**
 * Every indexable route. `/rss.xml`, `/search-index.json` and the 404 are
 * intentionally excluded — they aren't pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site.url}/writing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/resources`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Articles are the main reason to crawl this site, so they get the most
  // accurate lastModified available: the post's own date.
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/writing/${post.slug}`,
    lastModified: new Date(`${post.date}T09:00:00+08:00`),
    changeFrequency: "yearly",
    priority: post.featured ? 0.9 : 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(`${project.updated}T09:00:00+08:00`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Resource pages are the tool-shaped long tail: someone searching for a
  // specific product name should land on the record, not the index. Their
  // lastModified is the review month — that freshness claim is the whole point
  // of a directory, so it is the one date worth being precise about.
  const resourceRoutes: MetadataRoute.Sitemap = getAllResources().map((r) => ({
    url: `${site.url}/resources/${r.slug}`,
    lastModified: new Date(`${r.reviewed}-01T09:00:00+08:00`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts, ...projectRoutes, ...resourceRoutes];
}
