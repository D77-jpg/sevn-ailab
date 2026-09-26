# 更新记录

## 2026-09-23 · Cloudflare Pages 上线版

### 部署
- 改为纯静态导出（`output: "export"`），构建产物在 `out/`，可直接由 Cloudflare Pages 托管。
- 安全响应头抽到 `config/security-headers.mjs`，`next dev` 与生产共用；生产由 `scripts/postbuild.mjs` 生成 `out/_headers`。
  - 修正：HSTS 实际带了 `includeSubDomains`，与注释「不开」矛盾 → 去掉。
  - 修正：`frame-ancestors 'none'` 与 `X-Frame-Options: SAMEORIGIN` 不一致 → 改为 `DENY`。
  - 新增：`Cross-Origin-Opener-Policy`、`upgrade-insecure-requests`、静态资源长缓存、预览域名 noindex。
- OG 分享图：静态导出生成的是无扩展名文件，会被当成二进制下发 → 构建后统一改为 `.png` 并改写 HTML/RSC 与 JSON-LD 中的引用。
- 新增 `public/_redirects`（`/feed`、`/rss`、`/blog/*` 等）、`.node-version`、`engines`。
- `package-lock.json` 的 resolved 地址从 npmmirror 改回官方源（海外构建机访问镜像会 403）。

### 构建稳定性
- Geist 字体改用 `geist` npm 包本地托管，构建不再依赖 fonts.googleapis.com。
- OG 图中文字体改为仓库内置的 Noto Sans SC 子集，构建完全离线；缺字时才回退到 Google Fonts，并在日志中警告。
- 删除已无引用的旧衬线字体 `src/fonts/noto-serif-sc-*.woff2` 与 `scripts/subset-font.mjs`（V3 起全站无衬线）。

### 功能与界面
- `/writing` 改为客户端筛选（静态托管读不到 `?c=`），URL 保持不变；新增**按标签筛选** `?tag=`，标签云与文章页标签都可点击。
- 文章页目录：桌面端**随滚动高亮当前小节**；移动端新增可折叠目录。
- 首屏大图预编码为 AVIF/WebP（185 KB → 桌面 48 KB / 手机 19 KB）。
- OG 分享卡片配色与排版更新为 V3（原先仍是 V1 暖纸风）。
- 尚未开通的社媒渠道（`href: "#"`）显示为「即将开通」，不再是点了跳回页顶的死链接。
- 残留英文中文化：项目详情「Projects / Lab」→「项目」、「Build Log」→「开发日志」；资源详情「Resource Hub」→「资源库」。
- 项目详情「目前能跑通 / 还没解决」两栏标题层级统一为 `<h3>`。
- 新增 Web App Manifest。关于页与页脚技术栈更新为 Cloudflare Pages。
