import Link from "next/link";

import { StatusPill } from "@sevn/ui";

import { formatDate, type Kadian, type PlannedKadian, stages } from "@/lib/kadian";

/** Published 卡点 as links, planned ones as 「撰写中」 rows without a link. */
export function KadianList({
  published,
  planned,
}: {
  published: Kadian[];
  planned: PlannedKadian[];
}) {
  return (
    <div className="border-t border-line">
      {published.map((k) => (
        <Link key={k.slug} href={`/kadian/${k.slug}/`} className="spec-row group">
          <div className="min-w-0">
            <h3 className="text-[1.0625rem] leading-snug font-medium text-ink transition-colors duration-200 group-hover:text-accent">
              {k.title}
            </h3>
            <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-muted">{k.summary}</p>
          </div>
          <span className="mono-xs text-muted group-hover:text-accent">{stages[k.stage]}</span>
          <span className="mono tabular-nums">{formatDate(k.date)}</span>
          <span className="mono tabular-nums">{k.readingMinutes} 分钟</span>
        </Link>
      ))}
      {planned.map((p) => (
        <div key={p.slug} className="spec-row">
          <div className="min-w-0">
            <h3 className="text-[1.0625rem] leading-snug font-medium text-ink-2">{p.title}</h3>
            <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-muted">{p.summary}</p>
          </div>
          <span className="mono-xs">{stages[p.stage]}</span>
          <span>
            <StatusPill state="building" label="撰写中" />
          </span>
          <span />
        </div>
      ))}
    </div>
  );
}
