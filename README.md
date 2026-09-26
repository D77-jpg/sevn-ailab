# SEVN

两个站，一套设计系统。

| 目录 | 是什么 | 线上 |
|---|---|---|
| `apps/sevnai` | SEVN AILAB，个人 AI 实验室（原仓库全部内容，见其 README） | sevnai.site |
| `apps/gradlab` | SEVN GRADLAB，AI 方向毕设辅导站 | 待定（见 `apps/gradlab/src/lib/site.ts`） |
| `packages/design` | 设计令牌与 CSS 组件（原 `globals.css`） | — |
| `packages/ui` | 共用 React 组件：分区头、Logo 方块、主题切换、跨站链接 | — |

两站的视觉差异只有强调色：AILAB 蓝，GRADLAB 绿。设计规范见 [DESIGN.md](./DESIGN.md)。

## 开发

需要 Node.js ≥ 20.9。在仓库根目录：

```bash
npm install
npm run dev:sevnai      # http://localhost:3000
npm run dev:gradlab     # http://localhost:3001
npm run check           # 跨站链接校验 + 两站 lint / 类型 / 构建，推送前跑一遍
```

`npm run build`（根目录）只构建 sevnai，这是 Cloudflare 部署用的命令，别改。
构建 GRADLAB 用 `npm run build:gradlab`，产物在 `apps/gradlab/out/`。

## 两站之间的链接

- AILAB 文章 frontmatter 写 `gradTopic` + `gradTopicTitle`，文末出现「收窄成一个毕设题」入口。
  `npm run check:links` 会校验 slug 存在、标题一致。
- 所有跨站链接都用 `@sevn/ui` 的 `crossLink()`，自动带 `utm_source / utm_medium / utm_content`。
- 两站页脚都有一行「姊妹站」，GRADLAB 顶栏右侧有 `AILAB ↗` 切换入口。

合并与部署步骤见 [MIGRATION.md](./MIGRATION.md)。
