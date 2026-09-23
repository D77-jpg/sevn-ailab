import type { Post } from "./writing";
import type { Project } from "./projects";
import type { ResourceEntry } from "./resources";
import { getCategory, site, socials } from "./site";

/**
 * JSON-LD builders.
 *
 * Everything here describes something that is actually true of the page. Two
 * deliberate omissions, both because the honest version is the less impressive
 * one:
 *
 *   - **No `SearchAction`.** The site has search, but it is a client-side ⌘K
 *     dialog, not a URL-addressable endpoint. Declaring a `SearchAction` would
 *     put a search box in Google's sitelinks that points at `?q=…` — a URL that
 *     does not perform a search. That trades a real user's time for a richer
 *     snippet. Add it only if search becomes addressable.
 *
 *   - **No `sameAs` for placeholder profiles.** Several entries in `socials`
 *     still have `href: "#"`. Listing those would assert that profiles exist
 *     when they do not, which is exactly the kind of signal that gets a site's
 *     structured data distrusted. They are filtered out until they are real.
 */

const ORG = {
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.description,
} as const;

const PERSON = {
  "@type": "Person",
  name: site.author.name,
  jobTitle: site.author.role,
  url: site.url,
} as const;

/** Only real outbound profile URLs — `#` placeholders are dropped. */
function sameAs(): string[] {
  return socials
    .map((s) => s.href)
    .filter((href) => /^https?:\/\//.test(href));
}

/** Site-wide graph. Render once, in the root layout. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "zh-CN",
        publisher: { "@id": `${site.url}/#organization` },
      },
      {
        ...ORG,
        "@id": `${site.url}/#organization`,
        founder: { "@id": `${site.url}/#person` },
      },
      {
        ...PERSON,
        "@id": `${site.url}/#person`,
        sameAs: sameAs(),
      },
    ],
  };
}

/** Breadcrumb trail. `items` are [name, path] pairs, root first. */
export function breadcrumbSchema(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${site.url}${path}`,
    })),
  };
}

export function articleSchema(post: Post) {
  const url = `${site.url}/writing/${post.slug}`;
  const category = getCategory(post.category);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    // Stable URL without the build-time cache-busting hash.
    image: `${site.url}/writing/${post.slug}/opengraph-image.png`,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "zh-CN",
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#organization` },
    ...(category ? { articleSection: category.label } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
    ...(post.series ? { isPartOf: { "@type": "CreativeWorkSeries", name: post.series } } : {}),
  };
}

export function projectSchema(project: Project) {
  const url = `${site.url}/projects/${project.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.name,
    description: project.summary,
    url,
    image: `${site.url}/projects/${project.slug}/opengraph-image.png`,
    inLanguage: "zh-CN",
    creator: { "@id": `${site.url}/#person` },
    dateCreated: project.started,
    dateModified: project.updated,
    // `keywords` is the honest home for the stack — it is a description of the
    // work, not a claim about its status.
    keywords: project.stack.join(", "),
  };
}

/**
 * A Resource Hub entry.
 *
 * Two judgement calls, both about not overstating:
 *
 *   - **`review`, never `aggregateRating`.** The site shows a rating, but it is
 *     one person's opinion, not an aggregate. `aggregateRating` asserts a
 *     collection of ratings with a `ratingCount`; using it for a single
 *     editorial score is a false claim and the kind of thing that earns a
 *     manual action. A `Review` with one named author is what is actually true.
 *
 *   - **`about` is typed per group, and models get no specific type.** The
 *     tools are `SoftwareApplication` — you install and run them. There is no
 *     honest schema.org type for "a model you call over an API"; `Product`
 *     would imply merchant data the site does not have, so those fall back to
 *     `Thing` rather than borrowing a type that means something else.
 */
export function resourceSchema(entry: ResourceEntry) {
  const url = `${site.url}/resources/${entry.slug}`;

  const about: Record<string, unknown> = {
    "@type": entry.group === "models" ? "Thing" : "SoftwareApplication",
    name: entry.name,
    description: entry.use,
    url: entry.href,
  };

  if (entry.group !== "models") {
    about.applicationCategory = "DeveloperApplication";
    about.operatingSystem = "Web";
  }

  // Pricing is a sentence, not a number — the site does not model tiers or
  // currency, so an `Offer` here would be a shape without substance.
  about.offers = { "@type": "Offer", description: entry.pricing };

  about.review = {
    "@type": "Review",
    author: { "@id": `${site.url}/#person` },
    reviewRating: {
      "@type": "Rating",
      ratingValue: entry.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: entry.caveat,
  };

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: `${entry.name} — 资源记录`,
    description: entry.use,
    inLanguage: "zh-CN",
    // The review date, which is when this record's content last changed. For a
    // directory whose whole value is "is this still accurate", that freshness
    // signal is the point.
    dateModified: entry.reviewed,
    isPartOf: { "@id": `${site.url}/#website` },
    about,
  };
}
