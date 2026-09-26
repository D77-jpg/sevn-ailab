/**
 * Project Lab — the site's core asset. Each entry is a live build, not a
 * finished showcase: status, stack, and an append-only log of what happened.
 */

export type ProjectStatus = "shipped" | "building" | "research";

export type LogEntry = {
  date: string;
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  /** One line, no marketing. What it is. */
  summary: string;
  status: ProjectStatus;
  /** Human-readable status shown next to the dot. */
  statusLabel: string;
  stack: string[];
  started: string;
  updated: string;
  /** The problem this exists to solve. */
  why: string;
  /** What actually works right now — honest scope. */
  works: string[];
  /** What is still unsolved. */
  open: string[];
  links: { label: string; href: string }[];
  log: LogEntry[];
};

export const projects: Project[] = [
  {
    slug: "ai-comic-studio",
    index: "01",
    name: "AI Comic Studio",
    summary: "把小说文本转成分镜脚本，再生成风格一致的漫画分页。",
    status: "building",
    statusLabel: "构建中",
    stack: ["Next.js", "Supabase", "AI Image", "Edge Functions"],
    started: "2026-06",
    updated: "2026-09",
    why: "市面上的 AI 漫画工具大多停在「单张出图」，真正难的是跨页的角色一致性。这一版先解决一致性，再谈生成速度。",
    works: [
      "章节文本 → 分镜脚本的结构化抽取，输出稳定的 JSON schema",
      "角色设定卡（外观 / 服装 / 情绪）注入每次出图请求，锁定形象",
      "分页画布支持拖拽重排与单格重绘，不必整页重跑",
    ],
    open: [
      "跨页镜头语言仍然生硬，缺少景别与视线引导的自动规划",
      "批量出图的成本估算还没做成实时预览",
    ],
    links: [
      { label: "案例复盘", href: "/writing/ai-comic-studio-build-log" },
      { label: "GitHub", href: "https://github.com/sevnailab" },
    ],
    log: [
      {
        date: "2026-09",
        title: "角色一致性从 40% 提到 78%",
        body: "把「角色设定卡」从自然语言改成结构化字段后，同一角色跨 20 页的可用率从 40% 提升到 78%。关键是把发型、瞳色、服装这些最容易漂移的维度单独抽成枚举值，而不是塞在一段描述里。",
      },
      {
        date: "2026-08",
        title: "放弃一次性整页生成",
        body: "最初让模型一次输出整页四格，结果是一格崩全页崩。改成先出分镜脚本、再逐格生成，重绘成本从整页降到单格，迭代速度提上来一个量级。",
      },
      {
        date: "2026-06",
        title: "立项",
        body: "起点是一个很具体的问题：把一篇两万字的短篇做成漫画，人工分镜要花多久。答案是两周。目标是把这一步压到一天以内。",
      },
    ],
  },
  {
    slug: "ai-crm",
    index: "02",
    name: "AI CRM",
    summary: "给小团队用的轻量客户管理系统，把跟进记录变成自动摘要与待办。",
    status: "building",
    statusLabel: "迭代中",
    stack: ["Next.js", "Supabase", "Email", "LLM"],
    started: "2026-04",
    updated: "2026-09",
    why: "大厂 CRM 对小团队太重。真正需要的只是「这个人上次聊到哪了」和「我下一步该做什么」。",
    works: [
      "邮件与微信记录导入后自动生成客户时间线",
      "每次跟进结束自动产出下一步动作与提醒时间",
      "按阶段（线索 / 沟通 / 报价 / 成交）的看板视图",
    ],
    open: [
      "多语言邮件的摘要质量不稳定，非英语客户需要人工校对",
      "还没有做数据导出，锁死在小团队内部使用",
    ],
    links: [
      { label: "架构说明", href: "/writing/ai-crm-architecture" },
      { label: "GitHub", href: "https://github.com/sevnailab" },
    ],
    log: [
      {
        date: "2026-09",
        title: "把 LLM 从写入路径挪到读取路径",
        body: "原本每次新增跟进记录都同步调用模型做摘要，导致保存要等 3–5 秒。改成先落库、摘要异步补齐后，写入降到 200ms 以内，用户感知不到模型的存在——这才是它该有的样子。",
      },
      {
        date: "2026-05",
        title: "砍掉自定义字段",
        body: "花了三周做自定义字段系统，结果自己一次都没用过。删掉之后反而更快用起来了。小团队不需要灵活，需要默认值是对的。",
      },
    ],
  },
  {
    slug: "ai-digital-employee",
    index: "03",
    name: "AI Digital Employee",
    summary: "面向外贸场景的数字员工：接询盘、查库存、起草报价、跟进到底。",
    status: "research",
    statusLabel: "研究 / 构建中",
    stack: ["Agent", "MCP", "Tool Calling", "Automation"],
    started: "2026-07",
    updated: "2026-09",
    why: "不是要替代外贸业务员，而是接管其中重复度最高的 60%——询盘初筛、信息补全、标准品报价、常规跟进。",
    works: [
      "询盘意图分类与优先级排序，把无效询盘挡在第一层",
      "接 MCP 工具查产品库与库存，生成带约束的报价草稿",
      "多轮跟进节奏编排，超时自动升级给人工",
    ],
    open: [
      "议价环节完全无法放手，涉及价格谈判必须人工兜底",
      "多 Agent 之间的上下文传递还有明显的信息衰减",
    ],
    links: [
      { label: "路线图", href: "/projects/ai-digital-employee" },
      { label: "技术笔记", href: "/writing/mcp-in-practice" },
    ],
    log: [
      {
        date: "2026-09",
        title: "确定性优先：能用代码判断的绝不交给模型",
        body: "报价是否低于底价、库存是否够、客户是否在禁运名单——这三类判断全部改成纯代码校验，模型只负责组织语言。误报率从 12% 降到 0。模型擅长措辞，不擅长把关。",
      },
      {
        date: "2026-08",
        title: "用 MCP 替代硬编码工具",
        body: "一开始每个工具都写成函数直接注册。工具涨到 9 个之后，注册表开始失控。迁到 MCP 之后，工具变成可独立部署的服务，加工具不用动主流程代码。",
      },
    ],
  },
  {
    slug: "sevn-ailab",
    index: "04",
    name: "SEVN AILAB",
    summary: "这个网站本身。品牌站 + 内容中枢 + 资源库。",
    status: "shipped",
    statusLabel: "已上线",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"],
    started: "2026-09",
    updated: "2026-09",
    why: "社媒的流量是租来的，网站才是自己的。所有内容最终都要有一个能长期沉淀、能被搜索到的落点。",
    works: [
      "MDX + Git 的内容管线，写文章不需要开后台",
      "Project Lab 展示开发状态而不只是成品",
      "资源库按结构化字段沉淀，为长期搜索流量做准备",
      "全站搜索（Cmd/Ctrl + K）与 RSS 订阅已上线",
    ],
    open: [
      "Newsletter 订阅还没做，等 RSS 有真实订阅数据后再评估",
      "资源库的数据还需要持续补全",
    ],
    links: [{ label: "路线图", href: "/about" }],
    log: [
      {
        date: "2026-09",
        title: "站内搜索与 RSS 上线",
        body: "V1.5 的前两项提前完成：构建期生成 search-index.json，客户端做相关性排序的 Cmd+K 搜索；rss.xml 与 sitemap.xml 同步输出。没有引入任何第三方服务，全站仍然是纯静态。",
      },
      {
        date: "2026-09",
        title: "V1 上线",
        body: "刻意不做会员、支付、社区。先把内容体验和品牌质感做对，等真的有人来看、有人来问，再考虑加功能。",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const statusMeta: Record<
  ProjectStatus,
  { label: string; note: string }
> = {
  shipped: { label: "已上线", note: "已上线并稳定运行" },
  building: { label: "构建中", note: "正在迭代中" },
  research: { label: "研究", note: "探索与验证阶段" },
};
