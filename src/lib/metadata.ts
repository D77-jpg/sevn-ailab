import type { Metadata } from "next";

import { site } from "./site";

/**
 * Metadata is not deep-merged by Next.js.
 *
 * This is easy to misread: putting `alternates.types` (RSS) and `openGraph.url`
 * in the root layout does **not** make them defaults once a child route defines
 * its own `alternates` or `openGraph` object. And if a child defines neither,
 * it inherits the root's *homepage* canonical and social title verbatim.
 *
 * Use these builders instead of relying on nested metadata inheritance. They
 * make every indexable route state its own identity and keep the RSS discovery
 * link when `canonical` is overridden.
 */

export function pageAlternates(path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: path,
    types: { "application/rss+xml": "/rss.xml" },
  };
}

export function staticPageMetadata({
  title,
  description,
  path,
}: {
  /** The short title; the root title template adds `· SEVN AILAB` to `<title>`. */
  title: string;
  description: string;
  path: `/${string}`;
}): Metadata {
  // Open Graph / Twitter titles do not use the root title template, so make the
  // brand explicit here. A link preview should not require prior context.
  const socialTitle = `${title} · ${site.name}`;

  return {
    title,
    description,
    alternates: pageAlternates(path),
    openGraph: {
      type: "website",
      url: path,
      title: socialTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}
