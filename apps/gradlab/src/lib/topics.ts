/**
 * 选题库。每个题目都按同一组字段写，和 AILAB 资源库「统一字段」的做法一样：
 * 难度、工期、技术栈、适合谁、最容易翻车的地方——学生最想知道、别处最少写的。
 *
 * 贯穿所有题目的原则来自 SEVN AILAB 的构建日志：
 * 能用代码判断的，绝不交给模型。每个题目的创新点都是这句话的一个具体应用。
 *
 * `origin` 指向 AILAB 上的真实项目或文章，数字全部引自那边的原文，
 * 改动前请先核对原文，别让两站的数字对不上。
 */

export type Direction = "rag" | "agent" | "llm-app" | "aigc";

export const directions: Record<Direction, string> = {
  rag: "RAG 知识库",
  agent: "Agent / 工具调用",
  "llm-app": "大模型应用",
  aigc: "AIGC 生成",
};

export type Difficulty = 1 | 2 | 3;

export const difficultyLabel: Record<Difficulty, string> = {
  1: "入门",
  2: "中等",
  3: "偏难",
};

export type Topic = {
  slug: string;
  title: string;
  /** One line, shown in lists. */
  summary: string;
  direction: Direction;
  difficulty: Difficulty;
  /** Realistic duration for one undergraduate, part-time. */
  weeks: string;
  stack: string[];
  /** 适合谁 */
  audience: string;
  /** 最容易翻车的地方 */
  pitfall: string;
  /** 为什么值得做 */
  why: string;
  /** 必做范围：做完这些就能毕业 */
  must: string[];
  /** 选做加分：时间有余再做 */
  plus: string[];
  /** 创新点三件套：问题 / 处理 / 可测结果 */
  innovation: { problem: string; approach: string; measure: string };
  /** 验证方案：开题报告「研究方法」里直接能用的三行 */
  evaluation: { baseline: string; metric: string; dataset: string };
  /** 来自 SEVN AILAB 的真实项目 / 文章 */
  origin?: {
    label: string;
    /** Path on sevnai.site, e.g. `/projects/ai-crm` */
    path: string;
    /** A fact quoted from that page. */
    fact?: string;
  };
};

export const topics: Topic[] = [
  {
    slug: "rag-policy-qa",
    title: "基于 RAG 的校园规章问答系统（带条款引用校验）",
    summary:
      "学生手册、奖助学金办法这类文档天然按条款组织。按条款切分，回答必须引用条款编号，编号由程序核验。",
    direction: "rag",
    difficulty: 2,
    weeks: "8–10 周",
    stack: ["Python", "FastAPI", "Chroma", "大模型 API", "Vue 3"],
    audience: "会 Python 基础、第一次做 AI 项目的同学。",
    pitfall:
      "只做出一个「能问能答」的 demo，没有测试集。答辩被问「准确率多少、怎么算的」时答不上来。",
    why:
      "数据公开、好拿，不涉及隐私。「模型会编造不存在的条款」这个问题具体、可复现、可测量，本身就是一个站得住的创新点。",
    must: [
      "文档解析，并按「章 / 条 / 款」结构切分",
      "检索 + 生成的问答主流程",
      "回答必须附条款编号，程序校验编号是否真实存在，不存在就打回重答",
      "60 个问题的测试集和一键评测脚本",
    ],
    plus: [
      "与固定长度切分的对比实验",
      "多轮追问",
      "管理员上传新文档后增量更新索引",
    ],
    innovation: {
      problem: "大模型回答制度类问题时，会编造看起来很像的条款。",
      approach:
        "按条款结构切分知识库，并要求回答引用条款编号；编号由程序校验，模型无权「自证」。",
      measure: "测试集上的 Top-3 条款命中率和编造回答数，对比通用切分方式。",
    },
    evaluation: {
      baseline: "固定 500 字切分，不做引用校验",
      metric: "Top-3 条款命中率、编造回答数",
      dataset: "从手册里自己出 60 个问题，人工标注每题的正确出处",
    },
  },
  {
    slug: "tool-calling-inquiry",
    title: "基于 Tool Calling 的外贸询盘智能处理系统",
    summary:
      "模型负责读懂询盘、组织措辞；底价、库存、禁运三类判断全部交给代码。改编自一个真实跑过的数字员工项目。",
    direction: "agent",
    difficulty: 3,
    weeks: "10–12 周",
    stack: ["TypeScript 或 Python", "Function Calling", "SQLite", "React"],
    audience: "做过至少一个完整 Web 项目、想往 Agent 方向走的同学。",
    pitfall:
      "把所有判断都交给模型。演示时有人故意压价、要超出库存的量，系统照样满口答应。",
    why:
      "业务流程清楚，工具边界明确。「哪些判断交给代码、哪些交给模型」的取舍，正是答辩时最好讲、也最能体现你自己思考的部分。",
    must: [
      "询盘意图识别与关键信息抽取（产品、数量、目的地、目标价）",
      "3–4 个工具：查库存、查价格、查客户历史、起草回复",
      "底价、库存、禁运名单三类校验用代码实现，不通过则打回",
      "回复草稿经人工确认后才发送",
    ],
    plus: [
      "对比实验：全交给模型 vs 代码校验",
      "多轮跟进与操作日志",
    ],
    innovation: {
      problem: "模型在报价环节会做出低于底价或超出库存的承诺。",
      approach:
        "三层结构：模型理解与措辞，代码负责所有有确定答案的判断，人负责最终发送。",
      measure: "测试询盘上的违规回复数，拆分前后对比。",
    },
    evaluation: {
      baseline: "所有判断都交给模型",
      metric: "违规回复数 / 误报率",
      dataset: "80 条模拟询盘，含故意压价、超库存、禁运地区等刁难样本",
    },
    origin: {
      label: "AI 外贸数字员工",
      path: "/writing/seven-days-ai-digital-employee",
      fact: "原项目里，这一步把误报率从 12% 降到了 0。",
    },
  },
  {
    slug: "crm-followup-summary",
    title: "基于大模型的客户跟进摘要与待办生成系统",
    summary:
      "你最熟的管理系统，只在「读」这一侧加 AI：查看客户时才基于完整记录生成摘要和待办。",
    direction: "llm-app",
    difficulty: 1,
    weeks: "8–10 周",
    stack: ["Vue 3 或 Next.js", "Node.js 或 Python", "SQLite / PostgreSQL", "大模型 API"],
    audience: "会做增删改查的管理系统，想加 AI 但不想把题目做得太难的同学。",
    pitfall:
      "每写一条记录就调一次模型。成本高，摘要只看到局部，答辩时说不出为什么这么设计。",
    why:
      "工作量主体是你已经会的部分，AI 只加在一处，风险可控；而「模型该放在写入路径还是读取路径」是一个有数据支撑、讲得清的架构决策。",
    must: [
      "客户与跟进记录的增删改查",
      "查看客户时按需生成摘要与待办",
      "待办经确认后写回数据库",
      "每次调用的 token 用量统计",
    ],
    plus: [
      "摘要缓存与失效策略",
      "对比实验：写入时生成 vs 读取时生成",
    ],
    innovation: {
      problem: "在写入路径调用模型，成本随记录数线性增长，而且摘要只能看到局部记录。",
      approach: "把模型从写入路径挪到读取路径，查看时基于完整记录生成，并加缓存。",
      measure: "相同数据量下的调用次数、token 成本，以及人工打分的摘要质量。",
    },
    evaluation: {
      baseline: "每条记录写入时生成摘要",
      metric: "调用次数、token 成本、摘要质量（1–5 分人工打分）",
      dataset: "20 个模拟客户，每个 10–30 条跟进记录",
    },
    origin: {
      label: "AI CRM",
      path: "/writing/ai-crm-architecture",
      fact: "原项目这样调整后，成本降了大约 40%，摘要质量反而更好。",
    },
  },
  {
    slug: "novel-storyboard",
    title: "小说文本到分镜脚本的生成系统（角色一致性控制）",
    summary:
      "把章节拆成分镜，再按分镜生成画面。难点只有一个：同一个角色翻到下一页还得是同一个人。",
    direction: "aigc",
    difficulty: 3,
    weeks: "10–12 周",
    stack: ["Python", "大模型 API", "图像生成 API", "React"],
    audience: "对 AIGC 感兴趣、能接受反复实验和调参的同学。",
    pitfall:
      "只追求单张图好看。跨页同一个角色发型、衣服都变了，答辩现场一翻页就露馅。",
    why:
      "效果直观，答辩观感好；而且「一致性」有明确的可测指标，不会沦为「看起来还不错」。",
    must: [
      "章节切分为场景与分镜脚本（结构化 JSON 输出）",
      "结构化角色卡：发型、瞳色、服装等易漂移维度做成枚举字段",
      "按分镜生成画面，支持单格重绘",
      "跨页一致性人工评测",
    ],
    plus: [
      "对比实验：自然语言角色描述 vs 结构化角色卡",
      "分镜脚本的人工编辑界面",
    ],
    innovation: {
      problem: "同一角色在跨页生成中外观漂移。",
      approach: "用结构化角色卡替代自然语言描述，把最容易漂移的维度收成枚举值，减少模型的自由度。",
      measure: "同一角色跨页的可用率（人工判定）。",
    },
    evaluation: {
      baseline: "自然语言描述角色",
      metric: "同一角色跨页可用率",
      dataset: "2–3 个短篇章节，约 60 格分镜",
    },
    origin: {
      label: "AI Comic Studio",
      path: "/writing/ai-comic-studio-build-log",
      fact: "原项目里，同一角色跨 20 页的可用率从 40% 提到了 78%。",
    },
  },
  {
    slug: "mcp-campus-assistant",
    title: "基于 MCP 的校园事务助手（工具分级与人工确认）",
    summary:
      "用 MCP 给 Agent 接上查课表、查图书、约自习室等工具；不可逆操作必须停下来等人确认。",
    direction: "agent",
    difficulty: 2,
    weeks: "10–12 周",
    stack: ["TypeScript 或 Python", "MCP SDK", "大模型 API"],
    audience: "愿意学一个新协议、对 Agent 感兴趣的同学。",
    pitfall:
      "工具接得太多，模型乱调用；预约、取消这类操作没有确认，演示时误操作。",
    why:
      "MCP 是现在 Agent 接工具的主流协议，题目新、导师有兴趣，但官方资料已经够用，不至于无从下手。",
    must: [
      "3–5 个 MCP 工具（可以用模拟数据，不必接真实教务系统）",
      "工具按只读 / 可逆 / 不可逆分级",
      "不可逆操作中断流程，等待用户确认",
      "完整的调用日志",
    ],
    plus: ["对比实验：工具数量对调用准确率的影响"],
    innovation: {
      problem: "Agent 执行不可逆操作时，一次误判就收不回来。",
      approach: "按操作后果给工具分级，只读直接执行、可逆记日志、不可逆强制人工确认。",
      measure: "测试任务中未经确认执行的高风险操作次数、人工介入比例、任务完成率。",
    },
    evaluation: {
      baseline: "不分级，所有工具直接执行",
      metric: "未经确认的高风险操作次数、任务完成率",
      dataset: "40 条测试指令，包含有歧义和高风险的指令",
    },
    origin: {
      label: "MCP 实战",
      path: "/writing/mcp-in-practice",
    },
  },
  {
    slug: "code-feedback",
    title: "基于大模型的编程作业评阅与反馈系统",
    summary:
      "对错交给测试用例判，模型只根据失败信息写反馈，而且不许直接给出完整答案。",
    direction: "llm-app",
    difficulty: 2,
    weeks: "8–10 周",
    stack: ["Python", "Docker 沙箱", "大模型 API", "Vue 3"],
    audience: "计算机专业、刷过 OJ、对教育场景有兴趣的同学。",
    pitfall: "让模型直接判断代码对不对，结果时对时错，而且经常把答案整段写出来。",
    why:
      "对老师有真实价值，题目容易讲清楚；「判定交给测试、表达交给模型」的分工，是一个很干净的设计。",
    must: [
      "作业提交与沙箱运行",
      "测试用例判定对错",
      "模型基于失败用例和代码生成反馈，限制不输出完整答案",
      "教师端查看提交与反馈",
    ],
    plus: ["检测反馈是否泄露答案", "小范围同学试用与问卷"],
    innovation: {
      problem: "让模型直接判定代码对错，结果不稳定。",
      approach: "对错由测试用例判定，模型只负责把失败信息翻译成提示，并约束输出。",
      measure: "判定准确率（对比模型直接判），以及反馈中泄露完整答案的比例。",
    },
    evaluation: {
      baseline: "模型直接判定对错并写反馈",
      metric: "判定准确率、答案泄露率",
      dataset: "30 道题，每题准备正确与错误提交各若干份",
    },
    origin: {
      label: "Tool Calling 设计",
      path: "/writing/tool-calling-design",
    },
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
