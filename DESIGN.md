# Design System: SEVN AILAB

> **V3（当前）**：Apple 式极简科技风。暖白底（#F5F5F7）、近黑墨色（#1D1D1F）、发丝线（#D2D2D7）、
> 单一强调色 Apple Blue（#0071E3）。展示字体改为**无衬线大字号紧凑字距**（SF Pro / Geist / PingFang SC），
> 按钮与搜索框统一 999px 胶囊，圆角克制（8/14/22px），阴影极轻，无噪点纹理。
> Hero 为居中式：eyebrow → 超大标题（`Build with AI.`）→ 副标题 → 居中导语 → 胶囊 CTA → 低对比产品窗 → 四列数据带。
> V3.1 补充：文章目录随滚动高亮（左侧 2px accent 竖条，与规格表 hover 同语言）；移动端目录为可折叠面板；
> 未开通的社媒渠道以「即将开通」纯文本呈现，不渲染为链接。
> 本文档其余章节描述的 V1/V2「温暖编辑风」规格已被 V3 取代，仅保留作历史参考；以 `globals.css` 为准。
>
> ~~V2：编辑风 2.0 · 质感升级。~~
>
> ~~V1 设计基线。方向：温暖编辑风（Warm Editorial）。~~
>
> 设计约束（始终不变）：高级、克制、现代、开发者审美。**拒绝**模板化「AI 感」、
> 霓虹科技风、紫蓝渐变、发光边框、毛玻璃滥用。

---

## 1. Visual Theme & Atmosphere

这个站点是一个**个人 AI 实验室的公开工作台**，不是 SaaS 落地页，也不是教程站。
它应该读起来像一本排版精良的工程手记：有纸的暖度，有规格表的精确。

- **Density**：正文疏朗（行高 1.75），元数据密集（等宽、小字号、宽字距）。疏密对比本身就是节奏。
- **Mood**：安静、可信、有手感。没有一处装饰是为了「看起来科技」。
- **Design philosophy**：*结构靠留白和发丝线，不靠阴影和圆角。* 颜色只用来指路，不用来喧哗。

**Key Characteristics**

- 暖白纸底（非纯白）+ 暖近黑墨色（非纯黑），中性色统一带黄棕底调
- 展示字体为衬线（Newsreader），正文为无衬线（Geist），数据为等宽（Geist Mono）—— 三种角色三种字体，各司其职
- 分隔线一律 `1px` 发丝级，永远不加重
- 阴影为 3–4 层极低透明度叠加（单层 ≤ 0.045），暖色偏移，是「感觉到的深度」而非「看到的投影」
- 单一强调色（深墨蓝）只用于链接、焦点、主 CTA
- 语义色（shipped / building / research）只出现在 6px 圆点与极小标签上
- 极细的纸张噪点纹理（opacity ≤ 0.035）让暖白底有触感

---

## 2. Color Palette & Roles

全部使用 OKLCH，色相统一在 **68–85（暖黄棕）** 区间，保证中性色之间subconscious cohesion。

### Surfaces

| Token | Value | Role |
|---|---|---|
| `--paper` | `oklch(97.9% 0.0055 84)` | 页面画布，暖纸底 |
| `--paper-deep` | `oklch(95.6% 0.0075 82)` | 交替分区的下沉底色 |
| `--surface` | `oklch(99.4% 0.0025 84)` | 卡片、抬升面（比纸更亮，不靠阴影抬升） |
| `--surface-sunk` | `oklch(96.8% 0.006 83)` | 代码块、内嵌信息井 |

### Ink

| Token | Value | Role |
|---|---|---|
| `--ink` | `oklch(21.5% 0.011 68)` | 标题、正文。暖近黑，非 `#000` |
| `--ink-2` | `oklch(34% 0.012 68)` | 强次级文字、列表主项 |
| `--muted` | `oklch(51% 0.013 70)` | 描述、次级正文（AA ≥ 4.5:1） |
| `--faint` | `oklch(64% 0.011 72)` | 元数据、时间戳（仅用于 ≥12px 且非关键信息） |

### Hairlines

| Token | Value | Role |
|---|---|---|
| `--line` | `oklch(90.2% 0.007 80)` | 标准分隔线、卡片描边 |
| `--line-strong` | `oklch(84.5% 0.009 78)` | 输入框、需要稍强结构的边界 |

### Accent（唯一强调色）

| Token | Value | Role |
|---|---|---|
| `--accent` | `oklch(47% 0.125 253)` | 链接、主 CTA、焦点环 |
| `--accent-hover` | `oklch(40% 0.13 253)` | hover / pressed |
| `--accent-soft` | `oklch(96.4% 0.018 253)` | 选中背景、tint 标签底 |

> 强调色的使用量应 ≤ 界面视觉重量的 **10%**。它稀有，所以有效。

### Semantic（仅用于状态圆点与微标签）

| Token | Value | Meaning |
|---|---|---|
| `--st-ship` | `oklch(50% 0.105 152)` | Shipped / 已上线 |
| `--st-build` | `oklch(58% 0.125 62)` | Building / 进行中 |
| `--st-res` | `oklch(50% 0.09 300)` | Research / 探索中 |

**不可仅靠颜色传达信息** —— 圆点旁必须始终有文字标签。

### Dark Theme

深色不是浅色的反转。深色下**用更亮的表面表达层级，而不是阴影**，文字略微降重。

| Token | Dark Value |
|---|---|
| `--paper` | `oklch(17.5% 0.008 75)` |
| `--paper-deep` | `oklch(20% 0.009 75)` |
| `--surface` | `oklch(22% 0.009 74)` |
| `--surface-sunk` | `oklch(19% 0.008 74)` |
| `--ink` | `oklch(94% 0.006 80)` |
| `--ink-2` | `oklch(82% 0.008 78)` |
| `--muted` | `oklch(67% 0.012 76)` |
| `--faint` | `oklch(55% 0.011 76)` |
| `--line` | `oklch(29.5% 0.009 76)` |
| `--line-strong` | `oklch(37% 0.010 76)` |
| `--accent` | `oklch(74% 0.10 250)` |
| `--accent-hover` | `oklch(80% 0.09 250)` |
| `--accent-soft` | `oklch(28% 0.035 250)` |

深色下正文行高 +0.06（浅字在深底上视觉重量更轻）。

---

## 3. Typography Rules

### Families

| Role | Family | 说明 |
|---|---|---|
| Display / 标题 | **Newsreader**（衬线） | 编辑气质，Latin 展示。中文回退到系统衬线（Apple）/ 系统无衬线（Windows，避免 SimSun 劣化） |
| Body / UI | **Geist**（无衬线） | 开发者原生感，不落 Inter 俗套 |
| Data / 元数据 | **Geist Mono**（等宽） | 状态、技术栈、日期、编号、标签 |
| CJK | PingFang SC / Microsoft YaHei / Source Han | 系统字体，零下载成本 |

标题字体栈刻意把 `"Microsoft YaHei"` 放在通用 `serif` **之前**：
Apple 设备命中 `Songti SC` 得到真正的衬线编辑感；Windows 命中雅黑，
以干净无衬线优雅降级，而不是掉进 SimSun 的陈旧观感。

### Hierarchy

| Role | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|
| Display（首页 Hero） | `clamp(2.6rem, 1.4rem + 4.6vw, 4.75rem)` | 500 | 1.03 | -0.035em |
| H1（页面标题） | `clamp(2.1rem, 1.3rem + 3vw, 3.4rem)` | 500 | 1.08 | -0.028em |
| H2（分区标题） | `clamp(1.6rem, 1.15rem + 1.7vw, 2.3rem)` | 500 | 1.15 | -0.022em |
| H3（卡片标题） | `clamp(1.15rem, 1.02rem + .5vw, 1.35rem)` | 600 | 1.3 | -0.012em |
| Lead | `clamp(1.0625rem, 1rem + .35vw, 1.25rem)` | 400 | 1.6 | -0.005em |
| Body | `1.0625rem` (17px) | 400 | 1.75 | 0 |
| Small | `0.9375rem` | 400 | 1.65 | 0 |
| Meta | `0.75rem` | 500 | 1.4 | 0.06em |
| Micro label | `0.6875rem` | 600 | 1.3 | 0.12em, uppercase |

### Principles

- **字号少而对比大**：正文 17px → 分区标题 36px → Hero 76px。中间不塞 18/20/22 的泥潭。
- **压缩随尺度放大**：Tracking 从正文 `0` 收紧到 Hero `-0.035em`。大字号必须收紧才不散。
- **行高反向缩放**：正文 1.75 → H3 1.3 → Hero 1.03。
- **元数据永远等宽 + 宽字距**。这是全站唯一的「技术感」来源，也是品牌签名。
- **中文正文不用负字距**。Tracking 只作用于 Latin 展示层，中文段落保持 `0`，否则笔画会粘连。
- 正文固定 `rem`，只有展示层用 `clamp()` 流体缩放。
- 阅读宽度：正文 `max-width: 68ch`（中文约 34–38 字/行）。

---

## 4. Component Stylings

### Buttons

**Primary** — 实心墨色，非强调色（强调色留给链接，保持稀有）
- Background `--ink`，Text `--paper`，Padding `10px 18px`，Radius `--r-sm` (5px)
- Hover：background `--ink-2`，`translateY(-1px)`
- Focus：`2px` `--accent` outline + `2px` offset

**Secondary** — 描边幽灵
- Background transparent，Border `1px solid --line-strong`，Text `--ink`
- Hover：background `--surface`，border `--faint`

**Ghost / Link** — 透明，`--accent` 文字，hover 时下划线由左展开

### Cards

- Background `--surface`，Border `1px solid --line`，Radius `--r-md` (9px)
- Shadow `--shadow-2`（3 层，单层 ≤ 0.035）
- Hover：border 转为 `--line-strong`，shadow 升到 `--shadow-3`，`translateY(-2px)`
- **不做卡片套卡片**。卡片内需要分区时用发丝线，不用第二层容器。

### Pill / Status Badge

- Radius `--r-full`，Padding `3px 9px`，字号 11px，等宽，`letter-spacing: .06em`
- 前置 6px 圆点（`--st-*`）
- 底为 `color-mix(in oklab, var(--st-x) 9%, transparent)`，文字为 `--st-x`

### Section Header（签名组件）

```
01 / WRITING ──────────────────────────────────────────  [更多 →]
```

- 左侧：等宽序号 + 斜杠 + 大写标题，`--faint`
- 中间：`1px` 发丝线，`flex: 1`
- 右侧：可选的动作链接
- 这是全站最强的品牌识别元素，出现在每个分区顶部

### Spec Row（签名组件）

项目与文章列表使用「规格表」排布：

```
AI Comic Studio          BUILDING    Next.js · Supabase · AI Image    2026.08
```

- 名称用 `--ink`，中等字重，衬线或正文体
- 状态、技术栈、日期全部等宽、小字号、`--muted` / `--faint`
- 行间以 `1px` 发丝线分隔，**不用卡片**
- Hover：整行 `--surface` 底色 + 左侧 2px `--accent` 竖条

### Code

- Background `--surface-sunk`，Border `1px solid --line`，Radius `--r-md`
- 等宽，`font-variant-ligatures: none`，字号 13.5px，行高 1.7
- 顶部一行等宽语言标签 + 复制按钮
- 浅深两套 Shiki 主题，随 `data-theme` 切换

### Links in Prose

- 默认 `--accent`，`text-underline-offset: 3px`，`text-decoration-thickness: 1px`
- Hover：`--accent-hover`，decoration 加粗到 2px

---

## 5. Layout Principles

### Spacing

- Base unit `8px`，节奏锚定正文行高（17px × 1.75 ≈ 30px）
- 分区垂直内边距：桌面 `clamp(4.5rem, 8vw, 7.5rem)`，移动端 `clamp(3rem, 10vw, 4rem)`
- 分区之间用 `1px` 发丝线或底色切换分隔，**从不使用粗边框**

### Grid & Container

- 内容最大宽度 `1200px`，正文阅读列 `720px`
- 内边距：桌面 `32px`，移动 `20px`
- 首页分区为**不对称两栏**（`minmax(0,1fr) minmax(0,2fr)` 变体），避免「万物居中」

### Whitespace Philosophy

- 宁可多留白，不要多加装饰
- 交替使用 `--paper` 与 `--paper-deep` 制造分区节奏，不做生硬色块
- 内容块周围留白充足，块内信息密度高 —— 「白海中的信息岛」

### Radii

`--r-xs: 2px` · `--r-sm: 5px` · `--r-md: 9px` · `--r-lg: 16px` · `--r-full: 999px`

按钮与输入框用 `5px`（精确、工具感），卡片 `9px`，胶囊 `999px`。

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | 无阴影无边框 | 页面底色、正文 |
| 1 | `1px solid --line` | 标准分隔、列表行 |
| 2 | `--shadow-2`（3 层，≤ 0.035） | 卡片、列表项 hover |
| 3 | `--shadow-3`（4 层，≤ 0.045） | 卡片 hover、浮层 |
| 4 | `--shadow-4` + `1px --line` | 粘性导航、抽屉 |

阴影全部使用**暖色偏移**（`oklch(40% 0.03 70 / α)`），而非中性黑 —— 与纸底同源。

**深色模式下阴影几乎不可见**，层级改由 `--surface` 的亮度差承担。

---

## 7. Do's and Don'ts

### Do

- 用发丝线和留白建立结构
- 元数据一律等宽、大写、宽字距
- 状态色只出现在圆点与微标签
- 交替 `--paper` / `--paper-deep` 做分区节奏
- 衬线只用于标题与展示层，正文永远无衬线
- 动效只用指数缓出（`ease-out-quart` / `ease-out-expo`），时长 150–400ms

### Don't

- ❌ 紫蓝渐变、霓虹发光、彩虹描边
- ❌ 毛玻璃（backdrop-filter 仅允许用于粘性导航，且透明度 ≥ 0.85）
- ❌ 纯黑 `#000` / 纯白 `#fff` 大面积使用
- ❌ 圆角 + 通用投影的「万能卡片」
- ❌ 卡片套卡片
- ❌ 无意义的火花线、粒子、漂浮光斑
- ❌ 所有按钮都设为主按钮
- ❌ 回弹 / 弹性缓动
- ❌ 中文正文使用负字距
- ❌ 只靠颜色传达状态

---

## 8. Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | 单列；导航折叠为抽屉；Hero 降到 2.6rem；规格表折为两行堆叠 |
| Tablet | 640–900px | 两列网格；规格表保留但隐藏技术栈列 |
| Desktop | 900–1200px | 完整布局；三列网格 |
| Wide | > 1200px | 居中，最大 1200px，外边距加大 |

- 触摸目标 ≥ 44×44px
- 正文最小 16px，移动端 `1.0625rem`
- 规格表在移动端从「行」变为「块」，元数据换行保留等宽
- 关键功能**永不隐藏** —— 移动端折叠导航而非删除入口

---

## 9. Agent Prompt Guide

### Quick Reference

```
纸底     --paper        oklch(97.9% 0.0055 84)
卡片     --surface      oklch(99.4% 0.0025 84)
墨色     --ink          oklch(21.5% 0.011 68)
次级     --muted        oklch(51% 0.013 70)
发丝线   --line         oklch(90.2% 0.007 80)
强调     --accent       oklch(47% 0.125 253)
标题字   Newsreader / Songti SC
正文字   Geist / PingFang SC
元数据   Geist Mono
圆角     5px 按钮 · 9px 卡片 · 999px 胶囊
缓动     cubic-bezier(.165,.84,.44,1)
```

### 迭代守则

1. 先问「这处装饰在传达什么信息」。答不出来就删掉。
2. 结构问题优先用**留白**解决，其次用**发丝线**，最后才考虑边框或阴影。
3. 强调色的每一次新增使用，都要检查全页视觉重量是否仍 ≤ 10%。
4. 任何新增字体角色都要先确认它和 Newsreader / Geist / Geist Mono 三角色不冲突。
5. 元数据永远是等宽 —— 这是品牌的签名，不能破例。
6. 深色模式必须单独走查，不能假定浅色通过即通过。

---

## 10. V2 升级记录（编辑风 2.0）

方向不变，把「编辑感」从静态排版推进到**动态与细节**。所有新增动效均为
150–900ms 指数缓出，且全部被 `prefers-reduced-motion` 全局关停。

### 新签名元素

- **衬线斜体强调（`.em-serif`）**：Newsreader 的 italic 字重在 V1 加载了却从未使用。
  V2 起，展示标题中的**拉丁关键词**用斜体 + accent 色强调（如首页 `Build with *AI.*`）。
  ⚠️ 只用于拉丁文：CJK 没有真斜体，浏览器合成倾斜是坏的观感，永远不要给中文加这个类。
- **分隔线画入（`draw-line`）**：每个分区的签名发丝线在载入时从左侧画出（0.9s expo）。
  不做滚动触发——屏外的线安静画完即可，不为了炫技延迟内容。
- **Building 呼吸点（`pulse-dot`）**：三种状态里只有 building 的圆点会呼吸（2.4s）。
  语义：已上线是静止的，探索是安静的，进行中的东西是活的。
- **阅读进度条（`.scroll-progress`）**：粘性导航底边的 2px accent 细线，JS 直接写
  CSS 变量驱动 `scaleX`，不触发 React 重渲染。
- **杂志刊头与刊尾**：首页 Hero 顶部新增「刊号行」（左：实验室全名，右：EST. 年份）；
  页脚收尾于超大号衬线 `.wordmark`（墨色 12% 淡印 + 斜体 accent），杂志的最后一页。
- **移动端抽屉重设计**：从「压缩版导航」改为「编辑目录页」——衬线大字号链接 +
  等宽序号 + 逐项 stagger 入场。动画利用 `[hidden]` 切换自动重播，零 JS 编排。

### 排版与交互细节

- 文章首段自动成为 **lede**（`.prose > p:first-of-type`：19px / 1.65 / 墨色）。
- 规格表行 hover 时标题前移 3px（`.spec-row:hover h3`），与左侧 accent 竖条呼应。
- 主按钮 hover 增加 `--shadow-2` 提升感；导航激活下划线改为画入动画。
- 正文表格行增加 hover 底色，便于横向跟踪数据行。
- 内页 PageHero 统一加入 staggered `rise` 入场（V1 只有首页有）。
- Display 字号上限从 4.75rem 提到 5.5rem，首页开版更接近杂志封面。

### V2 守则补充

7. 斜体强调每个页面最多出现一次。它是调味品，不是食材。
8. 新增加载动画只允许「画入 / 升起」两类，禁止滚动触发的内容延迟显示。
