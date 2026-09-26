/**
 * SEVN GRADLAB — single source of truth for brand, contact and cross-site
 * links. Everything you need to change before launch is in this file and is
 * marked TODO.
 */

export const site = {
  name: "SEVN GRADLAB",
  // TODO(上线前): 换成最终域名。独立域名需要同时改 apps/sevnai/src/lib/site.ts 里的 gradlab.url
  domain: "grad.sevnai.site",
  url: "https://grad.sevnai.site",
  tagline: "AI 方向毕业设计辅导",
  description:
    "SEVN GRADLAB 只做 AI 方向的毕业设计辅导：RAG 知识库、Agent 与工具调用、AIGC 生成。先判断题目做不做得完，再陪你把开题、开发、论文、答辩每一步做通。代码你写，论文你写，答辩你讲。",
  author: {
    name: "SEVN",
    role: "AI 独立开发者，SEVN AILAB 主理人",
  },
} as const;

export const contact = {
  // TODO(上线前): 填真实微信号。留空时页面自动隐藏所有微信入口，只保留邮箱。
  wechat: "",
  // TODO(上线前): 确认邮箱。
  email: "hi@sevnai.site",
} as const;

/** The sister site. Every link to it goes through `crossLink` (UTM). */
export const sister = {
  name: "SEVN AILAB",
  url: "https://sevnai.site",
} as const;

/**
 * Referral for students whose topic is not AI — a Java/Python management
 * system, a mini-program. Those are better served elsewhere, and saying so
 * is part of being trustworthy.
 *
 * Set to `null` to remove every mention of it.
 * TODO(上线前): 和朋友打个招呼再开。
 */
export const referral: { name: string; url: string; note: string } | null = {
  name: "毕设无忧",
  url: "https://www.bysj888.com/",
  note: "Java / Python 管理系统、小程序这类经典方向，他们更擅长。",
};

/**
 * Analytics. Both are optional; leave empty to load nothing.
 * Events fired: `copy_wechat`, `copy_message`, `open_mail`, `referral_click`.
 */
export const analytics = {
  // TODO: 百度统计 site id（hm.js?xxxx 里的 xxxx）
  baidu: "",
} as const;

export const nav = [
  { label: "选题", href: "/#topics" },
  { label: "分工", href: "/#division" },
  { label: "卡点", href: "/kadian/" },
  { label: "咨询", href: "/#consult" },
] as const;

export function externalProps(href: string) {
  return /^https?:\/\//.test(href)
    ? { target: "_blank", rel: "noreferrer noopener" }
    : {};
}
