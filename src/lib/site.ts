/**
 * Single source of truth for brand, navigation, and social presence.
 * Everything user-facing that isn't content lives here.
 */

export const site = {
  name: "SEVN AILAB",
  domain: "sevnai.site",
  url: "https://sevnai.site",
  tagline: "Build with AI.",
  description:
    "SEVN AILAB 是一个个人 AI 实验室。记录如何用 Vibe Coding、Agent 开发与 AI 产品实战，把想法变成真正能跑起来的产品。",
  core: ["AI", "CODE", "AGENT"],
  author: {
    name: "SEVN",
    role: "AI 独立开发者",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Shown in the mobile drawer as a one-line description. */
  hint?: string;
};

export const nav: NavItem[] = [
  { label: "文章", href: "/writing", hint: "技术文章与项目复盘" },
  { label: "项目", href: "/projects", hint: "正在做的产品与实验" },
  { label: "资源", href: "/resources", hint: "工具 / 模型 / 开源项目" },
  { label: "关于", href: "/about", hint: "关于这个实验室" },
];

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  /** What you actually publish there — keeps the list honest, not decorative. */
  note: string;
};

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    handle: "@sevnailab",
    href: "https://github.com/sevnailab",
    note: "开源项目与源码",
  },
  {
    label: "微信公众号",
    handle: "SEVN AILAB",
    href: "#",
    note: "长文与观点",
  },
  {
    label: "小红书",
    handle: "@sevnailab",
    href: "#",
    note: "项目截图与短内容",
  },
  {
    label: "B站",
    handle: "@sevnailab",
    href: "#",
    note: "完整项目复盘",
  },
  {
    label: "抖音",
    handle: "@sevnailab",
    href: "#",
    note: "30–60 秒项目演示",
  },
  {
    label: "邮箱",
    handle: "hi@sevnai.site",
    href: "mailto:hi@sevnai.site",
    note: "合作与咨询",
  },
];

/** Category taxonomy for Writing. Slugs appear in `?c=` and in frontmatter. */
export const categories = [
  {
    slug: "vibe-coding",
    label: "Vibe Coding",
    description:
      "AI 编程工具与真实开发过程。把复杂的技术决策拆成可复现的实践步骤。",
  },
  {
    slug: "agent",
    label: "Agent",
    description:
      "从 Workflow、Tool Calling、MCP 到多 Agent 与企业数字员工。",
  },
  {
    slug: "ai-products",
    label: "AI Products",
    description:
      "Build in Public。正在做的产品、架构决策、踩坑记录与最终结果。",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
