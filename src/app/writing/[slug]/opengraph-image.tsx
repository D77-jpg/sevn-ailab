import { ImageResponse } from "next/og";

import { getAllPosts, getPost } from "@/lib/writing";
import { getCategory } from "@/lib/site";
import { loadOgFont } from "@/lib/og-font";
import { OG_FONT_FAMILY, OgCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  return [
    {
      id: "default",
      alt: post ? `${post.title} — SEVN AILAB` : "SEVN AILAB",
      size,
      contentType,
    },
  ];
}

/** `2026-09-14` -> `2026 · 09 · 14`. The middot is in the font subset. */
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
  const font = await loadOgFont();

  // generateStaticParams covers every real slug, so this is only reachable if
  // a slug is renamed and the image route is hit before the next build.
  if (!post) {
    return new ImageResponse(
      (
        <OgCard
          kicker="NOT FOUND"
          title="SEVN AILAB"
          meta="BUILD WITH AI"
          cjk={font !== null}
        />
      ),
      {
        ...size,
        fonts: font
          ? [{ name: OG_FONT_FAMILY, data: font, weight: 600, style: "normal" }]
          : [],
      },
    );
  }

  const category = getCategory(post.category);

  return new ImageResponse(
    (
      <OgCard
        kicker={category?.label ?? "WRITING"}
        title={post.title}
        subtitle={post.summary}
        meta={`${spacedDate(post.date)}   /   ${post.readingMinutes} MIN READ`}
        cjk={font !== null}
      />
    ),
    {
      ...size,
      fonts: font
        ? [{ name: OG_FONT_FAMILY, data: font, weight: 600, style: "normal" }]
        : [],
    },
  );
}
