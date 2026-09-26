/**
 * Cross-site links between SEVN AILAB and SEVN GRADLAB.
 *
 * Every link that crosses from one site to the other goes through `crossLink`
 * so it carries UTM parameters. That is what lets the analytics on each site
 * answer the only question that matters for the pair: which article or which
 * page actually sent someone over.
 */
export type SiteId = "sevnai" | "gradlab";

export function crossLink(
  href: string,
  {
    from,
    medium,
    content,
  }: {
    /** The site the link lives on. */
    from: SiteId;
    /** Where on the page: "footer", "article_cta", "topic_detail" … */
    medium: string;
    /** Which page / slug, so articles can be compared with each other. */
    content?: string;
  },
): string {
  const url = new URL(href);
  url.searchParams.set("utm_source", from);
  url.searchParams.set("utm_medium", medium);
  if (content) url.searchParams.set("utm_content", content);
  return url.toString();
}
