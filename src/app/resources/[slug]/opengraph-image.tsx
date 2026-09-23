import { ImageResponse } from "next/og";

import { getAllResources, getResource } from "@/lib/resources";
import { loadOgFont } from "@/lib/og-font";
import { OG_FONT_FAMILY, OgCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getResource(slug);
  return [
    {
      id: "default",
      alt: entry ? `${entry.name} — SEVN AILAB 资源记录` : "SEVN AILAB",
      size,
      contentType,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getResource(slug);
  const font = await loadOgFont();

  const fonts = font
    ? [{ name: OG_FONT_FAMILY, data: font, weight: 600 as const, style: "normal" as const }]
    : [];

  if (!entry) {
    return new ImageResponse(
      (
        <OgCard
          kicker="NOT FOUND"
          title="SEVN AILAB"
          meta="BUILD WITH AI"
          cjk={font !== null}
        />
      ),
      { ...size, fonts },
    );
  }

  return new ImageResponse(
    (
      <OgCard
        kicker={`RESOURCE  /  ${entry.groupLabel.toUpperCase()}`}
        title={entry.name}
        subtitle={entry.use}
        meta={`${entry.rating.toFixed(1)} / 5   ·   复核 ${entry.reviewed.replace("-", ".")}`}
        cjk={font !== null}
      />
    ),
    { ...size, fonts },
  );
}
