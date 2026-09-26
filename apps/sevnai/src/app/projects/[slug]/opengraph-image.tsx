import { ogImage, OG_SIZE } from "@/lib/og-card";
import { getProject, projects } from "@/lib/projects";

export const size = OG_SIZE;
export const contentType = "image/png";
// `generateImageMetadata` (per-page alt) is not supported by `output: "export"`.
export const alt = "SEVN AILAB — 项目卡片";
export const dynamic = "force-static";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return ogImage({ kicker: "NOT FOUND", title: "SEVN AILAB", meta: "BUILD WITH AI" });
  }

  return ogImage({
    kicker: `PROJECT / LAB  ${project.index}`,
    title: project.name,
    subtitle: project.summary,
    meta: `${project.stack.slice(0, 3).join("  ·  ")}`,
  });
}
