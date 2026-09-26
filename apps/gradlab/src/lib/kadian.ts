import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * 卡点文章：一篇只解决一个卡点，按毕设阶段组织。
 *
 * 已发布的文章是 content/kadian/*.mdx；还没写完的在 `planned` 里登记，
 * 首页和列表页会显示为「撰写中」，不生成详情页，也不进 sitemap。
 * 写完一篇：新建 mdx（slug 与 planned 里的一致），再把它从 planned 删掉。
 */

const DIR = path.join(process.cwd(), "content", "kadian");

export const stages = {
  xuanti: "选题",
  kaiti: "开题",
  kaifa: "开发",
  lunwen: "论文",
  dabian: "答辩",
} as const;

export type Stage = keyof typeof stages;

export type KadianFrontmatter = {
  title: string;
  summary: string;
  date: string;
  stage: Stage;
  tags?: string[];
  takeaway?: string;
  draft?: boolean;
};

export type Kadian = KadianFrontmatter & {
  slug: string;
  body: string;
  readingMinutes: number;
};

export type PlannedKadian = {
  slug: string;
  title: string;
  summary: string;
  stage: Stage;
};

/** 待写的卡点。顺序即计划中的发布顺序：先赶开题季。 */
export const planned: PlannedKadian[] = [
  {
    slug: "scope-in-12-weeks",
    title: "选题：怎么判断一个 AI 题目 12 周做得完",
    summary: "三个问题砍掉一半「听起来很酷」的题目：数据从哪来、指标是什么、最难的一步有没有退路。",
    stage: "xuanti",
  },
  {
    slug: "build-an-eval-set",
    title: "评测集：中期检查前最该补的一份数据",
    summary: "60 条手工标注的测试数据，比十页技术背景更能证明你做了事。怎么出题、怎么标、怎么跑。",
    stage: "kaifa",
  },
  {
    slug: "demo-day-survival",
    title: "部署：本地能跑，答辩现场跑不起来怎么办",
    summary: "API 超时、网络被墙、额度用完。答辩前一周就该准备好的三条退路。",
    stage: "dabian",
  },
  {
    slug: "why-not-just-call-api",
    title: "答辩：被问「为什么不直接调 API」怎么答",
    summary: "这是 AI 题答辩最常见的追问。答案不在技术细节里，而在你做过的那几个取舍里。",
    stage: "dabian",
  },
];

function readingMinutes(markdown: string): number {
  const cjk = (markdown.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) ?? []).length;
  const latin = (markdown.match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 400 + latin / 200));
}

export function getAllKadian(): Kadian[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      const fm = data as KadianFrontmatter;
      if (!(fm.stage in stages)) {
        throw new Error(`kadian/${file}: unknown stage "${fm.stage}"`);
      }
      return {
        ...fm,
        slug: file.replace(/\.mdx?$/, ""),
        tags: fm.tags ?? [],
        body: content,
        readingMinutes: readingMinutes(content),
      };
    })
    .filter((k) => !k.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getKadian(slug: string): Kadian | undefined {
  return getAllKadian().find((k) => k.slug === slug);
}

/** Published first, then planned — the list the homepage and index render. */
export function getKadianIndex() {
  const published = getAllKadian();
  const publishedSlugs = new Set(published.map((k) => k.slug));
  return {
    published,
    planned: planned.filter((p) => !publishedSlugs.has(p.slug)),
  };
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}
