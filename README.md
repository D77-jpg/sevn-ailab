# SEVN AILAB

个人 AI 实验室官网 — [sevnai.site](https://sevnai.site)

**Build with AI.** 记录 Vibe Coding、Agent 开发与 AI 产品实战的全过程：
架构决策、返工和踩坑，而不只是成功的部分。

纯静态站点，无 CMS、无数据库、无第三方运行时服务。
内容用 MDX + Git 管理，写文章不需要打开后台。

## 技术栈

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · MDX · next-mdx-remote · Shiki

## 开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建（全站静态预渲染）
npm run lint
```

## 目录结构

```
content/writing/     文章（MDX，frontmatter 驱动）
src/app/             路由：/ /writing /projects /resources /about
                     + rss.xml / sitemap.xml / search-index.json
src/components/      Header / Footer / Search(Cmd+K) / 文章与项目行组件
src/lib/             数据与管线：
                     site.ts        品牌、导航、社媒、分类（单一事实源）
                     projects.ts    Project Lab 数据（状态 / 技术栈 / 开发日志）
                     resources.ts   资源库数据（结构化九字段）
                     writing.ts     MDX 读取、阅读时长、标签统计
                     search.ts      客户端搜索索引构建
                     schema.ts      JSON-LD 结构化数据
src/fonts/           自托管 Noto Serif SC 子集（见下文）
scripts/             subset-font.mjs 字体子集化
```

设计基线见 [DESIGN.md](./DESIGN.md)（温暖编辑风：暖纸底、衬线标题、
等宽元数据、发丝线，拒绝霓虹渐变与模板化「AI 感」）。

## 写一篇文章

在 `content/writing/` 新建 `my-post.mdx`：

```mdx
---
title: "标题"
summary: "一句话摘要，用于列表与 SEO"
date: "2026-09-21"
category: "vibe-coding"        # vibe-coding | agent | ai-products
tags: ["Claude Code", "MCP"]
featured: true                  # 可选：出现在首页
draft: true                     # 可选：从所有索引隐藏
takeaway: "一句话结论"           # 可选：显示在文章页
---

正文……支持 GFM 表格与代码高亮。
```

文件名即 URL slug（`/writing/my-post`）。构建时自动生成 OG 图、
RSS、sitemap 与搜索索引，无需手工维护。

## 项目与资源数据

- **Projects** 编辑 `src/lib/projects.ts`：状态（shipped / building /
  research）、技术栈、`works` / `open` 清单、append-only 开发日志。
- **Resources** 编辑 `src/lib/resources.ts`：每条九个字段（用途、价格、
  免费额度、评分、适合谁、缺点、复核时间……），改完更新 `reviewed`。

## 字体子集

中文标题使用自托管的 Noto Serif SC 子集（仅标题/引用用到的字符，
~90 KB，替代 Google Fonts 按需切片的 ~1 MB）。

内容变更后如需同步字符集，手动运行（需要 playwright-core 与 Chromium，
且能访问 Google Fonts）：

```bash
npm run dev &                    # 先起一个本地服务
BASE=http://localhost:3000 npm run fonts
```

产出 `src/fonts/*.woff2` 与 `charset.txt`，提交进仓库；**不**挂在
`prebuild` 上，避免 CI/部署环境因缺少浏览器或网络而构建失败。

## 部署

静态站点，任何静态托管均可。Vercel 零配置；安全响应头（CSP、
frame-ancestors 等）在 `next.config.ts` 中统一配置。
