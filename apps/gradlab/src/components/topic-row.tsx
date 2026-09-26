import Link from "next/link";

import { difficultyLabel, directions, type Topic } from "@/lib/topics";

/**
 * A topic as a datasheet row — the same `.spec-row` AILAB uses for posts and
 * resources: title and summary on the left, then direction / difficulty /
 * duration in mono. Rows, not cards, on both sites.
 */
export function TopicRow({ topic }: { topic: Topic }) {
  return (
    <Link href={`/topics/${topic.slug}/`} className="spec-row group">
      <div className="min-w-0">
        <h3 className="text-[1.0625rem] leading-snug font-medium tracking-[-0.005em] text-ink transition-colors duration-200 group-hover:text-accent">
          {topic.title}
        </h3>
        <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-muted">
          {topic.summary}
        </p>
        <p className="mono-xs mt-2.5">{topic.stack.join(" · ")}</p>
      </div>

      <span className="mono-xs text-muted transition-colors duration-200 group-hover:text-accent">
        {directions[topic.direction]}
      </span>
      <span className="mono">
        <Dots level={topic.difficulty} /> {difficultyLabel[topic.difficulty]}
      </span>
      <span className="mono tabular-nums">{topic.weeks}</span>
    </Link>
  );
}

export function TopicRowLegend() {
  return (
    <div className="hidden border-b border-line pb-2.5 md:grid md:grid-cols-[minmax(0,1fr)_11.5rem_10rem_5.5rem] md:gap-x-5 md:px-[0.875rem]">
      <span className="mono-xs">题目</span>
      <span className="mono-xs">方向</span>
      <span className="mono-xs">难度</span>
      <span className="mono-xs">工期</span>
    </div>
  );
}

/** Difficulty as three dots, filled up to the level. Text label follows. */
export function Dots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span aria-hidden className="mr-1 inline-flex gap-[3px] align-middle">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`block size-[6px] rounded-full ${i <= level ? "bg-ink" : "bg-line"}`}
        />
      ))}
    </span>
  );
}
