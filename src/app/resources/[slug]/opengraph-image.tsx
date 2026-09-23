import { ogImage, OG_SIZE } from "@/lib/og-card";
import { getAllResources, getResource } from "@/lib/resources";

export const size = OG_SIZE;
export const contentType = "image/png";
// `generateImageMetadata` (per-page alt) is not supported by `output: "export"`.
export const alt = "SEVN AILAB — 资源记录卡片";
export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getResource(slug);

  if (!entry) {
    return ogImage({ kicker: "NOT FOUND", title: "SEVN AILAB", meta: "BUILD WITH AI" });
  }

  return ogImage({
    kicker: `RESOURCE  /  ${entry.groupLabel.toUpperCase()}`,
    title: entry.name,
    subtitle: entry.use,
    meta: `${entry.rating.toFixed(1)} / 5   ·   REVIEWED ${entry.reviewed.replace("-", ".")}`,
  });
}
