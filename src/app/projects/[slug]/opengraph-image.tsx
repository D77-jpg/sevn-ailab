import { ImageResponse } from "next/og";

import { getProject, projects } from "@/lib/projects";
import { loadOgFont } from "@/lib/og-font";
import { OG_FONT_FAMILY, OgCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return [
    {
      id: "default",
      alt: project ? `${project.name} — SEVN AILAB` : "SEVN AILAB",
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
  const project = getProject(slug);
  const font = await loadOgFont();

  const fonts = font
    ? [{ name: OG_FONT_FAMILY, data: font, weight: 600 as const, style: "normal" as const }]
    : [];

  if (!project) {
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
        kicker={`PROJECT / LAB  ${project.index}`}
        title={project.name}
        subtitle={project.summary}
        meta={project.statusLabel.toUpperCase()}
        cjk={font !== null}
      />
    ),
    { ...size, fonts },
  );
}
