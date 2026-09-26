import type { MetadataRoute } from "next";

import { getAllKadian } from "@/lib/kadian";
import { site } from "@/lib/site";
import { topics } from "@/lib/topics";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const kadian = getAllKadian();
  const latest = kadian[0]?.date ?? "2026-09-26";
  return [
    { url: `${site.url}/`, lastModified: latest, priority: 1 },
    { url: `${site.url}/kadian/`, lastModified: latest, priority: 0.7 },
    ...topics.map((t) => ({ url: `${site.url}/topics/${t.slug}/`, priority: 0.9 })),
    ...kadian.map((k) => ({ url: `${site.url}/kadian/${k.slug}/`, lastModified: k.date, priority: 0.8 })),
  ];
}
