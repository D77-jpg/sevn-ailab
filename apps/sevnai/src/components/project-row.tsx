import Link from "next/link";

import type { Project } from "@/lib/projects";
import { formatDate } from "@/lib/format";
import { StatusPill } from "@sevn/ui";

/** A project rendered as a datasheet row — status and stack are the point. */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="spec-row group">
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="mono-xs shrink-0 text-accent">
            {project.index}
          </span>
          <h3 className="min-w-0 text-[1.0625rem] leading-snug font-medium tracking-[-0.005em] text-ink transition-colors duration-200 group-hover:text-accent">
            {project.name}
          </h3>
        </div>
        <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-muted">
          {project.summary}
        </p>
      </div>

      <span className="justify-self-start">
        <StatusPill state={project.status} label={project.statusLabel} />
      </span>

      <span className="mono truncate text-[0.6875rem] tracking-[0.04em]">
        {project.stack.slice(0, 3).join(" · ")}
      </span>

      <span className="mono tabular-nums">{formatDate(project.updated)}</span>
    </Link>
  );
}
