# 合并与上线说明

## 1. 合并到 main 之前

1. 推送分支：`git push -u origin monorepo-gradlab`
2. 在 Cloudflare 看这个分支的预览部署，确认 sevnai.site 的预览版本正常。
3. 没问题再合并到 `main`。

**Cloudflare 的构建设置不用改。** `wrangler.jsonc` 仍在仓库根目录，已经改为发布
`apps/sevnai/out`；根目录 `npm run build` 只构建 sevnai。根目录、构建命令、部署命令保持原样。

如果构建机报找不到 `@sevn/design` 或 `@sevn/ui`，说明依赖没按 workspace 安装，
把构建命令改成 `npm ci && npm run build` 即可。

## 2. 上线 GRADLAB 之前

改 `apps/gradlab/src/lib/site.ts` 里所有标了 TODO 的地方：

- `site.url` / `site.domain`：最终域名。同时改 `apps/sevnai/src/lib/site.ts` 里的 `gradlab.url`。
- `contact.wechat`：微信号。留空时页面自动隐藏微信入口，只保留邮箱。
- `contact.email`：确认邮箱。
- `analytics.baidu`：百度统计 id，留空则不加载任何统计脚本。
- `referral`：非 AI 方向转介给毕设无忧。先和朋友打个招呼；不需要就设为 `null`。

## 3. 部署 GRADLAB

```bash
npm run build:gradlab    # 产物：apps/gradlab/out/
```

纯静态文件，放哪都行。受众是国内学生，建议域名备案后放国内对象存储 + CDN
（腾讯云 COS / 阿里云 OSS 开启静态网站托管，索引文档 `index.html`，错误文档 `404.html`）。
路由都是 `目录/index.html` 形式（`trailingSlash: true`），对象存储无需额外重写规则。

上线后去百度搜索资源平台提交 `/sitemap.xml`。

## 4. 写卡点文章

在 `apps/gradlab/content/kadian/` 新建 `slug.mdx`，frontmatter：

```yaml
title: "…"
summary: "…"
date: "2026-10-08"
stage: "kaiti"      # xuanti 选题 / kaiti 开题 / kaifa 开发 / lunwen 论文 / dabian 答辩
tags: ["…"]
takeaway: "…"       # 可选
```

如果它原本在 `apps/gradlab/src/lib/kadian.ts` 的 `planned` 里（显示为「撰写中」），
slug 保持一致即可自动替换；也可以顺手把那一项删掉。
