/**
 * Resource Hub — structured, not a link dump. Every entry answers the same
 * nine questions, so the pages can be compared and, later, searched.
 */

export type ResourceGroup = "vibe-coding" | "agent" | "models";

export type Resource = {
  /** Stable URL segment. Explicit, not derived from `name`:
   * "Claude Code" and "Claude" are different entries. */
  slug: string;
  /** Month this record was last checked. Prices drift. */
  reviewed: string;
  name: string;
  /** What it is, in one line. */
  use: string;
  href: string;
  /** Pricing model as of the last review. */
  pricing: string;
  freeTier: string;
  /** 1–5, in half steps. This is an opinion, not a spec. */
  rating: number;
  /** Who should actually bother. */
  audience: string;
  /** The honest caveat. */
  caveat: string;
  /** Slugs of related writing or projects. */
  related?: { label: string; href: string }[];
};

export const resourceGroups: {
  slug: ResourceGroup;
  label: string;
  blurb: string;
}[] = [
  {
    slug: "vibe-coding",
    label: "Vibe Coding",
    blurb: "AI 编程工具。关注点是真实项目里的可用度，不是跑分。",
  },
  {
    slug: "agent",
    label: "Agent",
    blurb: "构建 Agent 需要的基础设施与协议。",
  },
  {
    slug: "models",
    label: "Models",
    blurb: "按任务选模型，而不是按榜单。",
  },
];

export const resources: Record<ResourceGroup, Resource[]> = {
  "vibe-coding": [
    {
      name: "Claude Code",
      slug: "claude-code",
      reviewed: "2026-09",
      use: "终端里的编程 Agent，适合大范围重构与跨文件改动。",
      href: "https://claude.com/product/claude-code",
      pricing: "订阅制 / 按量计费",
      freeTier: "随 Claude 订阅额度",
      rating: 4.5,
      audience: "需要跨多个文件改动的中大型项目",
      caveat: "长上下文下容易「过度热心」，改到你没让它改的地方。任务边界要写死。",
      related: [
        { label: "工具链实测", href: "/writing/vibe-coding-toolchain-2026" },
      ],
    },
    {
      name: "Cursor",
      slug: "cursor",
      reviewed: "2026-09",
      use: "带 AI 的编辑器，Tab 补全和行内改写是目前最顺手的。",
      href: "https://cursor.com",
      pricing: "免费档 + 订阅",
      freeTier: "有，额度有限",
      rating: 4.5,
      audience: "习惯图形编辑器、需要频繁小步修改的人",
      caveat: "补全太顺会让人停止思考。复杂逻辑建议先自己写骨架。",
    },
    {
      name: "OpenAI Codex",
      slug: "openai-codex",
      reviewed: "2026-09",
      use: "云端异步执行任务，适合可以离线跑、你不想盯着的活儿。",
      href: "https://openai.com/codex",
      pricing: "随 ChatGPT 订阅",
      freeTier: "随订阅额度",
      rating: 4,
      audience: "有明确验收标准的独立任务",
      caveat: "异步意味着反馈循环慢，任务描述不清就是浪费一次额度。",
    },
    {
      name: "Cline",
      slug: "cline",
      reviewed: "2026-09",
      use: "开源编辑器内 Agent，工具调用过程完全可见。",
      href: "https://cline.bot",
      pricing: "开源免费（自付模型 API）",
      freeTier: "完全免费",
      rating: 4,
      audience: "想看清 Agent 每一步在干什么、并愿意自付 API 的人",
      caveat: "每一步都确认很安全，但也很累。信任建立后建议开自动批准。",
    },
    {
      name: "Zed",
      slug: "zed",
      reviewed: "2026-09",
      use: "高性能编辑器，内置 Agent 面板，启动与输入延迟明显更低。",
      href: "https://zed.dev",
      pricing: "开源免费 + 可选订阅",
      freeTier: "完全免费",
      rating: 3.5,
      audience: "对编辑器响应速度敏感的人",
      caveat: "插件生态还在追赶，某些语言支持不如成熟编辑器完整。",
    },
  ],
  agent: [
    {
      name: "Model Context Protocol (MCP)",
      slug: "mcp",
      reviewed: "2026-09",
      use: "把工具和数据源标准化成可独立部署的服务，Agent 按协议接入。",
      href: "https://modelcontextprotocol.io",
      pricing: "开放协议，免费",
      freeTier: "完全免费",
      rating: 5,
      audience: "工具数量开始失控、或需要复用工具的团队",
      caveat: "协议解决的是接入问题，不解决工具设计问题。工具本身切得太碎，MCP 也救不了。",
      related: [{ label: "MCP 实战", href: "/writing/mcp-in-practice" }],
    },
    {
      name: "LangGraph",
      slug: "langgraph",
      reviewed: "2026-09",
      use: "用图结构编排有状态的多步骤 Agent 流程。",
      href: "https://langchain-ai.github.io/langgraph/",
      pricing: "开源免费",
      freeTier: "完全免费",
      rating: 4,
      audience: "流程分支多、需要明确状态机的场景",
      caveat: "概念成本不低。流程本身简单的话，一个 for 循环加几个 if 更划算。",
    },
    {
      name: "Browser Use",
      slug: "browser-use",
      reviewed: "2026-09",
      use: "让 Agent 直接操作浏览器，处理没有 API 的系统。",
      href: "https://github.com/browser-use/browser-use",
      pricing: "开源免费",
      freeTier: "完全免费",
      rating: 3.5,
      audience: "必须对接遗留系统、没有 API 可用的情况",
      caveat: "页面一改就崩，且很难调试。永远把它当作最后手段。",
    },
    {
      name: "Playwright",
      slug: "playwright",
      reviewed: "2026-09",
      use: "确定性浏览器自动化。给 Agent 当「手」，比自己瞎点可靠得多。",
      href: "https://playwright.dev",
      pricing: "开源免费",
      freeTier: "完全免费",
      rating: 5,
      audience: "任何需要浏览器操作的 Agent",
      caveat: "需要预先写好选择器。但这份确定性正是它比纯视觉方案可靠的原因。",
    },
  ],
  models: [
    {
      name: "Claude",
      slug: "claude",
      reviewed: "2026-09",
      use: "长文写作、代码重构、需要遵循复杂约束的任务。",
      href: "https://claude.ai",
      pricing: "按量 / 订阅",
      freeTier: "有",
      rating: 4.5,
      audience: "写作与工程混合场景",
      caveat: "价格偏高。简单分类任务用它属于浪费。",
    },
    {
      name: "GPT",
      slug: "gpt",
      reviewed: "2026-09",
      use: "通用能力均衡，工具调用生态最成熟。",
      href: "https://openai.com",
      pricing: "按量 / 订阅",
      freeTier: "有",
      rating: 4.5,
      audience: "需要稳定 Function Calling 的 Agent 项目",
      caveat: "风格偏保守，创意类任务需要更多引导。",
    },
    {
      name: "Gemini",
      slug: "gemini",
      reviewed: "2026-09",
      use: "超长上下文与多模态输入，适合整库阅读。",
      href: "https://deepmind.google/technologies/gemini/",
      pricing: "按量 / 订阅",
      freeTier: "有，额度较宽",
      rating: 4,
      audience: "需要一次读入大量文档或视频的场景",
      caveat: "长上下文里的细节召回不稳定，关键信息别指望它一定记住。",
    },
    {
      name: "DeepSeek",
      slug: "deepseek",
      reviewed: "2026-09",
      use: "推理与代码任务性价比高，中文表现扎实。",
      href: "https://www.deepseek.com",
      pricing: "按量，价格低",
      freeTier: "有",
      rating: 4.5,
      audience: "对成本敏感、以中文和代码为主的批量任务",
      caveat: "高峰期延迟波动明显，不适合对响应时间敏感的实时交互。",
    },
    {
      name: "GLM",
      slug: "glm",
      reviewed: "2026-09",
      use: "中文场景与工具调用稳定，国内接入无障碍。",
      href: "https://www.zhipuai.cn",
      pricing: "按量",
      freeTier: "有",
      rating: 4,
      audience: "需要国内合规接入与低延迟的项目",
      caveat: "英文长文写作不如头部模型，混合场景要分流。",
    },
  ],
};

export function countResources(): number {
  return Object.values(resources).reduce((n, list) => n + list.length, 0);
}

/** A resource plus the group it belongs to — what a detail page needs. */
export type ResourceEntry = Resource & {
  group: ResourceGroup;
  groupLabel: string;
  groupBlurb: string;
};

export function getAllResources(): ResourceEntry[] {
  return resourceGroups.flatMap((group) =>
    resources[group.slug].map((item) => ({
      ...item,
      group: group.slug,
      groupLabel: group.label,
      groupBlurb: group.blurb,
    })),
  );
}

export function getResource(slug: string): ResourceEntry | undefined {
  return getAllResources().find((r) => r.slug === slug);
}

/**
 * Neighbours within the same group, wrapping at the ends.
 *
 * Scoped to the group rather than the whole hub: "next" after Playwright being
 * Claude (a model) would be a category error, not navigation.
 */
export function getAdjacentResources(slug: string): {
  next?: ResourceEntry;
  group?: ResourceGroup;
} {
  const all = getAllResources();
  const current = all.find((r) => r.slug === slug);
  if (!current) return {};

  const siblings = all.filter((r) => r.group === current.group);
  const i = siblings.findIndex((r) => r.slug === slug);

  return {
    next: siblings[(i + 1) % siblings.length],
    group: current.group,
  };
}
