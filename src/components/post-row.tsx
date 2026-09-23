import Link from "next/link";

import { getCategory } from "@/lib/site";
import { formatDate, type Post } from "@/lib/writing";

/**
 * A post rendered as a datasheet row: title + summary on the left, then
 * category / date / reading time in mono. Deliberately not a card.
 */
export function PostRow({ post, index }: { post: Post; index?: number }) {
  const category = getCategory(post.category);

  return (
    <Link href={`/writing/${post.slug}`} className="spec-row group">
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          {typeof index === "number" && (
            <span className="mono-xs hidden shrink-0 sm:inline">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className="min-w-0 text-[1.0625rem] leading-snug font-medium tracking-[-0.005em] text-ink transition-colors duration-200 group-hover:text-accent">
            {post.title}
          </h3>
        </div>
        <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-muted">
          {post.summary}
        </p>
      </div>

      <span className="mono-xs text-muted transition-colors duration-200 group-hover:text-accent">
        {category?.label ?? post.category}
      </span>

      <span className="mono tabular-nums">{formatDate(post.date)}</span>

      <span className="mono tabular-nums">
        {post.readingMinutes} 分钟
      </span>
    </Link>
  );
}

/** Column legend for lists of PostRow. */
export function PostRowLegend() {
  return (
    <div className="hidden border-b border-line pb-2.5 md:grid md:grid-cols-[minmax(0,1fr)_11.5rem_10rem_5.5rem] md:gap-x-5 md:px-[0.875rem]">
      <span className="mono-xs">标题 / 摘要</span>
      <span className="mono-xs">分类</span>
      <span className="mono-xs">日期</span>
      <span className="mono-xs">阅读</span>
    </div>
  );
}
