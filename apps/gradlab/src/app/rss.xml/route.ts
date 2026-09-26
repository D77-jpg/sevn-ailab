import { getAllKadian } from "@/lib/kadian";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getAllKadian()
    .map(
      (k) => `    <item>
      <title>${esc(k.title)}</title>
      <link>${site.url}/kadian/${k.slug}/</link>
      <guid>${site.url}/kadian/${k.slug}/</guid>
      <pubDate>${new Date(`${k.date}T08:00:00+08:00`).toUTCString()}</pubDate>
      <description>${esc(k.summary)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.name)} · 卡点</title>
    <link>${site.url}/</link>
    <description>${esc(site.description)}</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
