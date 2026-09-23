import { JsonLd } from "@/components/json-ld";
import { ProjectRow } from "@/components/project-row";
import { PageHero, SectionLabel } from "@/components/ui";
import { staticPageMetadata } from "@/lib/metadata";
import { projects, statusMeta, type ProjectStatus } from "@/lib/projects";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = staticPageMetadata({
  title: "项目 / 实验室",
  description:
    "SEVN AILAB 正在做的 AI 产品：状态、技术栈、架构决策与开发日志。",
  path: "/projects",
});

const order: ProjectStatus[] = ["building", "research", "shipped"];

export default function ProjectsPage() {
  const grouped = order
    .map((status) => ({
      status,
      items: projects.filter((p) => p.status === status),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          ["首页", "/"],
          ["项目", "/projects"],
        ])}
      />
      <PageHero
        eyebrow="项目 / 实验室"
        title={
          <>
            正在做的
            <br />
            产品与实验
          </>
        }
        lead="这里不放成品截图。放的是状态、技术栈、为什么做、目前能跑通什么，以及还没解决的问题。"
        meta={
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {order.map((status) => {
              const count = projects.filter((p) => p.status === status).length;
              if (!count) return null;
              return (
                <li key={status} className="flex items-baseline gap-2">
                  <span className="status" data-state={status}>
                    {statusMeta[status].label}
                  </span>
                  <span className="mono-xs">{statusMeta[status].note}</span>
                </li>
              );
            })}
          </ul>
        }
      />

      {grouped.map((group, gi) => (
        <section
          key={group.status}
          className={`section ${gi === 0 ? "pt-0" : ""}`}
        >
          <div className="shell">
            <SectionLabel index={String(gi + 1).padStart(2, "0")}>
              {statusMeta[group.status].label}
            </SectionLabel>

            <div className="border-t border-line">
              {group.items.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section pt-0">
        <div className="shell">
          <div className="border border-dashed border-line-strong px-6 py-12 text-center">
            <p className="mono-xs">实验室日志</p>
            <p className="mx-auto mt-4 max-w-[46ch] font-serif text-h3 text-ink">
              所有开发日志都写在项目详情页里，按时间倒序。
            </p>
            <p className="mx-auto mt-3 max-w-[52ch] text-[15px] text-muted">
              包括失败的尝试。判断失误的记录比成功记录更值得保留。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
