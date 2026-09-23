# SEVN AILAB

个人 AI 实验室官网 — [sevnai.site](https://sevnai.site)

**Build with AI.** 记录 Vibe Coding、Agent 开发与 AI 产品实战的全过程：
架构决策、返工和踩坑，而不只是成功的部分。

纯静态站点（`next build` → `out/`），部署在 **Cloudflare Pages**。
无 CMS、无数据库、无第三方运行时服务。
内容用 MDX + Git 管理，写文章不需要打开后台。

## 技术栈

Next.js 15 (App Router, static export) · TypeScript · Tailwind CSS v4 · MDX · Shiki · Cloudflare Pages

## 开发

需要 Node.js ≥ 20.9（推荐 22，见 `.node-version`）。

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 静态导出到 out/，并生成 _headers、修正 OG 图扩展名
npm run preview    # 本地预览 out/（近似 Cloudflare 的 /about → about.html 行为）
npm run check      # lint + 类型检查 + 构建，推送前跑一遍
```

> 国内网络装依赖慢，可以临时用镜像：`npm install --registry=https://registry.npmmirror.com`。
> **不要**把镜像地址写回 `package-lock.json`——Cloudflare 的构建机在海外，访问镜像会 403。

## 目录结构

```
content/writing/     文章（MDX，frontmatter 驱动）
src/app/             路由：/ /writing /projects /resources /about
                     + rss.xml / sitemap.xml / robots.txt / manifest / search-index.json
src/components/      Header / Footer / Search(⌘K) / 目录(TOC) / 文章筛选 / 行组件
src/lib/             数据与管线：
                     site.ts        品牌、导航、社媒、分类（单一事实源）
                     projects.ts    项目数据（状态 / 技术栈 / 开发日志）
                     resources.ts   资源库数据（结构化字段）
                     writing.ts     MDX 读取、阅读时长、标签统计
                     search*.ts     搜索匹配（客户端）与索引构建（构建期）
                     og-*.ts(x)     分享卡片（OG 图）
config/              security-headers.mjs  安全响应头（dev 与生产共用）
assets/og/           OG 图用的 Noto Sans SC 子集（仅构建期使用，不发给浏览器）
public/              静态资源、_redirects、首屏图的 AVIF/WebP 版本
scripts/             postbuild.mjs        构建后处理（_headers、OG 图 .png）
                     optimize-images.mjs  重新生成首屏图（npm run images）
                     subset-og-font.py    重新生成 OG 字体子集
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

## 部署到 Cloudflare Pages（连接 GitHub 自动构建）

### 一次性设置

1. 仓库已推送：`https://github.com/D77-jpg/sevn-ailab`（私有，默认分支 `main`）。
   重新推送用 `git push origin main`；本仓库 `origin` 已配好。
2. Cloudflare 控制台 → **Workers 和 Pages** → **创建** → **Pages** → **连接到 Git**，选择仓库。
3. 构建设置：

   | 项 | 值 |
   |---|---|
   | 框架预设 | **无（None）**。不要选 “Next.js”——那个预设走 `next-on-pages`（服务端模式），本站是纯静态导出 |
   | 构建命令 | `npm run build` |
   | 构建输出目录 | `out` |
   | 根目录 | 仓库根目录（如果仓库里 `sevn-ailab/` 是子目录，这里填 `sevn-ailab`） |
   | 环境变量 | `NODE_VERSION` = `22`（`.node-version` 已声明，这里再写一次更保险） |

4. 保存并部署。首次构建约 1–2 分钟，完成后得到 `xxx.pages.dev` 预览地址。
5. 项目 → **自定义域** → 添加 `sevnai.site`（以及 `www.sevnai.site`）。域名已在 Cloudflare 托管时会自动配好 DNS。

之后每次 `git push` 到生产分支（默认 `main`）会自动构建上线；其它分支和 PR 会得到独立的预览地址，
预览域名自动带 `X-Robots-Tag: noindex`，不会和正式站抢收录。

### 建议的 Cloudflare 域名设置

- **SSL/TLS** → 加密模式「完全（严格）」；**边缘证书** → 开启「始终使用 HTTPS」。
- **www 跳转**：规则 → 重定向规则 → 模板「从 WWW 重定向到根域」（`_redirects` 只能处理路径，不能处理主机名）。
- **关闭** 速度 → 优化里的 **Rocket Loader**，以及 Scrape Shield 里的 **电子邮件地址混淆**。
  这两个功能都会往页面里注入脚本、改写 `<script>`，会被站点的 CSP 拦截，轻则控制台报错，重则页面无法交互、`mailto:` 链接失效。
- 想开 **Web Analytics**：先在 `config/security-headers.mjs` 里按注释放行 `static.cloudflareinsights.com`，否则统计脚本会被 CSP 拦下。

### 构建产物里有什么

- 每个页面一个 `.html`（Cloudflare 会把 `/about` 映射到 `about.html`），外加客户端导航用的 `.txt`（RSC 载荷）。
- `404.html`：Pages 自动用作未匹配路径的 404 页。
- `_headers`：由 `scripts/postbuild.mjs` 从 `config/security-headers.mjs` 生成——CSP、HSTS、缓存策略都在这里。
  **改响应头请改 `config/security-headers.mjs`**，不要手改 `out/_headers`。
- `_redirects`：来自 `public/_redirects`（`/feed`、`/blog/*` 等常见旧路径）。
- 分享卡片 `*/opengraph-image.png`：构建期用 `assets/og/` 里的中文字体渲染，**构建不需要联网**。

## OG 分享图字体

分享卡片用 `assets/og/NotoSansSC-*.subset.otf`（GB2312 一级常用字 ~3,750 个 + 站内所有已用字，约 1.6 MB，
只在构建时读取）。新文章如果用到子集外的生僻字，构建会先尝试从 Google Fonts 补齐这几个字；
补不到时会在构建日志里打印醒目的警告。永久修复：

```bash
pip install fonttools
python3 scripts/subset-og-font.py     # 需要本机有 Noto Sans CJK（apt install fonts-noto-cjk）
```

## 首屏图

替换 `public/hero-desk.jpg` 后运行 `npm run images`，会重新生成 828/1672 宽的 AVIF 与 WebP 版本。
